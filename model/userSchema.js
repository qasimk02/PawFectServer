const mongooose = require('mongoose');
const bcrypt = require ('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongooose.Schema({
    name: {
        type: String,
        required:true
    },
    email: {
         type: String,
        required:true
    },
    phone: {
        type: Number,
        required:true
    },
    work: {
        type: String,
        required:true
    },
    password: {
        type: String,
        required:true
    },
    cpassword: {
        type: String,
        required:true
    },
    date: {
        type: Date,
        default: Date.now
    },
    messages:[
        {
            name: {
                type: String,
                required:true
            },
            email: {
                 type: String,
                required:true
            },
            phone: {
                type: Number,
                required:true
            },
            message: {
                type: String,
                required:true
            }
        }   
    ],
    tokens: [
        {
            token:{
                type: String,
                required:true
            }
        }
    ]
})

//hashiing the password pre and post 

userSchema.pre('save', async function(next) {
        console.log("hi from inside");
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 12);
        this.cpassword = await bcrypt.hash(this.cpassword, 12);
    }
    next();
});

//token jwt
userSchema.methods.generateAuthToken = async function () {
    try {
        let token = jwt.sign({_id: this._id} , process.env.SECRET_KEY );
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token;
    
    } catch(err){
        console.log(err);

    } 
};

// store the message

userSchema.methods.addMessage = async function(name, email, phone, message){
    try {
        this.messages = this.messages.concat({name:name, email, phone, message});
        await this.save();
        return this.messages;
    }catch(error){
        console.log(error)
    }

}

const User = mongooose.model('USER', userSchema);

module.exports = User;
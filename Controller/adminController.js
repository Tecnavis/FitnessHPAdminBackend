const adminModel = require('../Model/adminModel');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// exports.postadmin = asyncHandler(async(req, res)=>{
//     const {name, email, phone, role, password}= req.body
//     const image = req.file ? req.file.filename : undefined;
//     try{
//         const postAdmin = await adminModel.create({

//             name:name,
//             email:email,
//             phone:phone,
//             role:role,
//             image:image,
//             password:password
//         })
//         res.json(postAdmin)
           
//     }catch(err){
//         console.log(err)
//     }
// })

// exports.postsignin = asyncHandler(async(req, res) => {
//     const { email, password } = req.body;
//     console.log(password);
    
//     try {
//         const postSignin = await adminModel.findOne({ email });

//         if (!postSignin) {
//             return res.status(400).json({ error: "Invalid email or password" });
//         }

//         const isPasswordMatch = await bcrypt.compare(password, postSignin.password);

//         if (!isPasswordMatch) {
//             return res.status(400).json({ error: "Invalid email or password" });
//         }

//         const token = jwt.sign({ email: postSignin.email }, "myjwtsecretkey");
//         const userProfile = {
//             id: postSignin._id,
//             name: postSignin.name,
//             email: postSignin.email,
//             role: postSignin.role,
//             phone: postSignin.phone,
//             image: postSignin.image,
//         };

//         console.log(token , 'the token from backend');
//         res.status(200).json({ token: token, admin: userProfile });
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// });

exports.postsignin = asyncHandler(async(req, res) => {
    const { email, password } = req.body;
    
    try {
        const postSignin = await adminModel.findOne({ email });

        if (!postSignin) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const isPasswordMatch = await bcrypt.compare(password, postSignin.password);

        if (!isPasswordMatch) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const token = jwt.sign({ email: postSignin.email }, "myjwtsecretkey");

        // Update the admin document in the database to save the token
        await adminModel.findByIdAndUpdate(postSignin._id, { token: token });

        const userProfile = {
            id: postSignin._id,
            name: postSignin.name,
            email: postSignin.email,
            role: postSignin.role,
            phone: postSignin.phone,
            image: postSignin.image,
        };

        res.status(200).json({ token: token, admin: userProfile });
        console.log(token,'the token is here')
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


exports.getAdmin = asyncHandler(async(req,res)=>{
    try{
        const getItems = await adminModel.find();
        res.status(200).json(getItems);
        console.log(getItems, 'the get items')
    }catch(err){
        console.error(err);
        res.status(500).json({error:"an error occurred while fectching data"})
    }
})

exports.getAdminById = asyncHandler(async(req,res)=>{
    const {id} = req.params
    try {
        const response = await adminModel.findById(id)
        res.status(200).json(response)
    } catch (error) {
        console.log(error)
        res.status(500).send('An error occured while fetching data')
    }
})

exports.editAdmin = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    const {name, phone, role, email} = req.body;
    const image = req.file ? req.file.filename : undefined;
    console.log(req.params,'tjhe id')
    console.log(req.body,'tjhe body')
    console.log(req.file,'tjhe body')
    try{  
        const update = {
            image:image, 
            name:name,
            phone:phone,
            role:role,
            email:email
        }
        console.log(update,'the data of update')
        const updateData = await adminModel.findByIdAndUpdate(id, {$set:update}, {new:true})
        res.status(200).json(updateData)
       
    }catch(err){
        res.status(500).json({err:'error while updating data'})
    }
})
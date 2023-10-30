const UserModel = require('../models/User')
const bcrypt = require('bcrypt');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
       cloud_name: 'dzqhnuroo',
       api_key: '434622187235975',
       api_secret: 'Q5hut4Hs9Xth4FtfghjpwG4T3Sw'
      
});

class UserController {
       static getalluser = async (req, res) => {
              try {
                     res.send('hello user')
              } catch (error) {
                     console.log('error')
              }

       }

       static userinsert = async (req, res) => {
              const { name, email, password,confirmpassword } = req.body
              const image = req.files.image
              const image_upload = await cloudinary.uploader.upload(image.tempFilePath, {
                     folder: 'Profile Imageapi'
              })
              //     console.log(image_upload)

              const user = await UserModel.findOne({ email: email })
              if (user) {
                     res
                            .status(401)
                            .json({ status: "failed", message: "THIS EMAIL ALREADY EXITS" });
              } else {
                     if (name && email && password && confirmpassword) {
                            if (password == confirmpassword) {
                                   try {

                                          const hashpassword = await bcrypt.hash(password, 10)
                                          const result = new UserModel({
                                                 name: name,
                                                 email: email,
                                                 password: hashpassword,
                                                 image: {
                                                        public_id: image_upload.public_id,
                                                        url: image_upload.secure_url,
                                                 },
                                          })

                                          await result.save();
                                          res.status(201).json({
                                                 status: "success",
                                                 message: "Registration Successfully",
                                          });
                                   } catch (error) {
                                          console.log(error)
                                   }
                            } else {
                                   res
                                          .status(401)
                                          .json({ status: "failed", message: "PASSWORD & CONFIRMPASSWORD DONES NOT MATCH" });
                            }


                     } else {
                            req.flash('error', 'all feild are required')
                            res.redirect('/register')
                     }
              }
       }
}

module.exports = UserController
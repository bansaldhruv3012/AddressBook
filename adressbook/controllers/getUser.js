const addUser = require("../models/userBook");

const fs = require("fs");

const deleteFile = filePath => {
   let path = "image/" + filePath;
   console.log(path);
   fs.unlink(path, err => {
      if (err) {
         console.log(err);
      }
   });
};

exports.getUser = (req, res, next) => {
   //    console.log(req.user._id);
   const mySort = { name: 1 };
   return (
      addUser
         .find({ userId: req.user._id })
         .populate("userId")
         .sort(mySort)
         //   .select("email phone -_id")
         //   .populate("userId", "name")
         .then(user => {
            // console.log(user[0].userId.name);
            res.render("addressbook.ejs", {
               bookusers: user,
               path: "/getUser",
               userId: req.user.name
            });
         })
         .catch(err => {
            console.log(err);
         })
   );
};

exports.deleteUser = (req, res, next) => {
   console.log(req.user._id);
   const userbookId = req.body.userbookId;
   console.log(userbookId);
   addUser
      .findById(userbookId)
      .then(user => {
         if (user.urlPath != "avatar.png") {
            deleteFile(user.urlPath);
         }
         return addUser.deleteOne({ _id: userbookId, userId: req.user._id });
      })
      .then(() => {
         console.log("deleted");
         res.redirect("/getUser");
      })
      .catch(err => {
         console.log(err);
      });
};

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect(process.env.key, {useNewUrlParser: true, useUnifiedTopology: true});
const itemSchema = new mongoose.Schema({
  name: String
});

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
  name: "Buy Good And Relevant Books."
});
// item1.save();
const item2 = new Item({
  name: "Place the order on Amazon."
});
// item2.save();
const item3 = new Item({
  name: "Then Study Data Structure."
});
// item3.save();
const defaultArray = [ item1, item2, item3 ];

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemSchema]
});

const List = mongoose.model("List", listSchema);




app.get("/", function(req, res) {
  Item.find({}, function(err, foundItems){

    if(foundItems.length===0)
    {
      Item.insertMany( defaultArray, function(err){
        if(err)
        console.log(err);
        else
        console.log("Successfully Logged!");
      });
      res.redirect("/");
    }  else {
      res.render("list", {
        listTitle: "Today",
        newListItems:foundItems,
      });
    }
  });

});
app.get("/:customListName", function(req, res){
const customListName = _.capitalize(req.params.customListName);
List.findOne({name: customListName}, function(err, foundList){
  if(!err){
    if(!foundList){
      // Create a new list
      const list = new List({
        name: customListName,
        items: defaultArray
      });

      list.save();
      res.redirect("/" + customListName);
    } else {
       // Show an existing list
       res.render("list", {
         listTitle: foundList.name,
       newListItems:foundList.items
     });
    }
  }
});


});

app.post("/", function(req, res){
  let itemName=req.body.newItem;
  const listName=req.body.list;
  const item = new Item({
    name: itemName
  });

  if(listName==="Today"){
    item.save();
    res.redirect("/");

  } else {
    List.findOne({name: listName}, function(err, foundList){
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
});

app.post("/delete", function(req, res){
  const checkedId = req.body.checkbox;
  const listName = req.body.listName;

  if(listName==="Today"){
    Item.findByIdAndRemove(checkedId, function(err){
      if(!err)
      console.log("Successfully Removed");
    });
    res.redirect("/");
  } else {
    List.findOneAndUpdate({name:listName}, {$pull: {items: {_id:checkedId}}}, function(err, foundList){
      if(!err)
      res.redirect("/" + listName);
    });
  }

});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}


app.listen(port, function() {
  console.log("Server is up and running.");
})

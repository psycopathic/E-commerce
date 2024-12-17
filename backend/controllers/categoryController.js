import Category from "../models/categoryModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const createCategory = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;
    if (!name.trim()) {
      return res.json({
        error: "Name is required",
      });
    }

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.json({
        error: "Category already exists",
      });
    } else {
      const category = await Category.create({ name });
      return res.json(category);
    }
  } catch (err) {
    console.log(err);
    return res.status(404).json({
      message: "an error occured !!!",
    });
  }
});

const updateCategory = asyncHandler(async (req, res) => {
    try{
        const { name } = req.body;
        const { categoryId } = req.params;
        const category = await Category.findById(categoryId);
        if(!category){
            return res.status(404).json({error:"Category not found"})
        }
        category.name = name;

        const updatedCategory = await category.save();
        res.json(updatedCategory);
    }catch(error){
        res.status(500).json({error:"Internal server error"})
    }
})

const removeCategory = asyncHandler(async (req, res) => {
    try {
        const removed = await Category.findByIdAndDelete(req.params.categoryId);
        res.json(removed);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

const listCategory = asyncHandler(async (req, res) => {
    try {
        const all = await Category.find({});
        res.json(all);
    } catch (error) {
        console.log(error);
        return res.status(400).json(error.message);
    }
})

const readCategory = asyncHandler(async (req, res) => {
    try{
        const category = await Category.findOne(req.params.categoryId);
        res.json(category);
    }catch(error){
        console.log(error);
        res.status(500).json({error:"Internal server error"})
    }
})
export {createCategory,updateCategory,removeCategory,listCategory,readCategory};

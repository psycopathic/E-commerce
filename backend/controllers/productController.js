import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModal.js";

const addProduct = asyncHandler(async (req, res) => {
  try {
    const { name, description, price, category, quantity, brand } = req.fields;

    // Validation
    switch (true) {
      case !name:
        return res.json({ error: "Name is required" });
      case !brand:
        return res.json({ error: "Brand is required" });
      case !description:
        return res.json({ error: "Description is required" });
      case !price:
        return res.json({ error: "Price is required" });
      case !category:
        return res.json({ error: "Category is required" });
      case !quantity:
        return res.json({ error: "Quantity is required" });
    }

    const product = new Product({ ...req.fields });
    await product.save();
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});


const updateProductDetails = asyncHandler(async (req, res) => {
    try {
      const { name, description, price, category, quantity, brand } = req.fields;
  
      // Validation
      switch (true) {
        case !name:
          return res.status(400).json({ error: "Name is required" });
        case !brand:
          return res.status(400).json({ error: "Brand is required" });
        case !description:
          return res.status(400).json({ error: "Description is required" });
        case !price:
          return res.status(400).json({ error: "Price is required" });
        case !category:
          return res.status(400).json({ error: "Category is required" });
        case !quantity:
          return res.status(400).json({ error: "Quantity is required" });
      }
  
      // Find and update the product
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        { ...req.fields },
        { new: true, runValidators: true } // Ensure updated document is returned and validators are applied
      );
  
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      await product.save();
  
      res.json(product);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  const removeProduct = asyncHandler(async (req, res) => {
    try{
        const product = await Product.findByIdAndDelete(req.params.id);
        res.json(product);
    }catch(error){
        console.log(error);
        res.status(500).json({error:"Internal server error"})
    }
  });

  const fetchProduct = asyncHandler(async(req,res)=>{
    try{
       const pageSize = 6;

       const keyword = req.query.keyword
       ? {
           name: {
             $regex: req.query.keyword,
             $options: "i",
           },
         }
       : {};

       const count = await Product.countDocuments({ ...keyword });
       const products = await Product.find({ ...keyword }).limit(pageSize);

       res.json({ 
        products, 
        page:1, 
        pages:Math.ceil(count / pageSize), 
        hasMore: false, 
     });

    }catch(error){
        console.log(error);
        res.status(500).json({error:"Server error"});
    }
  })

 const fetchProductById = asyncHandler(async(req,res)=>{
    try {
        const product  = await Product.findById(req.params.id);
        
        if(product){
            return res.json(product);
        }else{
            res.status(404);
            throw new Error("Product not found");
        }
    } catch (error) {
        console.log(error);
        res.status(404).json({error:"Internal server error"})
    }
 })

 const fetchAllProducts = asyncHandler(async(req,res)=>{
      try {
        const product = await Product.find({})
        .populate("category")
        .limit(12)
        .sort({createAt: -1});
        res.json(product);
      } catch (error) {
        console.log(error);
        res.status(500).json({error:"Internal server error"})
      }
 })

 const addProductReview = asyncHandler(async(req,res)=>{
  try {
    const {rating,comment} = req.body;
    const product = await Product.findById(req.params.id);

    if(product){
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if(alreadyReviewed){
        res.status(400);
        throw new Error("You already reviewed this product");
      }
      const review = {
        name: req.user.username,
        rating: Number(rating),
        comment,
        user: req.user._id,
      }
      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({message:"Review added"});
    }else{
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({error:"Internal server error"})
  }
 })

 const fetchTopProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({}).sort({ rating: -1 }).limit(4);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

 const fetchNewProducts = asyncHandler(async(req,res)=>{
      try{
        const products = await Product.find().sort({_id:-1}).limit(5);
        res.json(products);
      }catch(error){
        console.log(error);
        res.status(400).json(error.message);
      }
 })

 const filterProducts = asyncHandler(async(req,res)=>{
  try {
    const { checked, radio } = req.body;

    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };

    const products = await Product.find(args);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
 })

export { addProduct, updateProductDetails, removeProduct, fetchProduct,fetchProductById, fetchAllProducts, addProductReview,fetchTopProducts,fetchNewProducts,filterProducts };
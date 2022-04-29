import express from "express";
import expressAsyncHandler from "express-async-handler";
import data from "../data.js";
import Product from "../models/productModel.js";

const productRouter = express.Router();

productRouter.get('/', expressAsyncHandler(async (req, res)=>{    
    const products = await Product.find({}); /** The empty curly brackets as a parameter returns all product */
    res.send(products);
}));

productRouter.get('/seed', expressAsyncHandler(async (req, res)=>{
    //** This is for restart the seed or data at the database */
    //** We need to access to the link to make it happens - http://localhost:5000/api/products/seed */
    //** Notice the port is pointed out the BACKEND = 5000 */

    // This line is to restart the seed of the database
    //await Product.remove({});
    const createdProducts = await Product.insertMany(data.products);
    res.send({createdProducts});
}));

/** This comes at the end bcz /seed will treated as a parameter if its defined before the func above 
    yeah! THE POSITIONS OF THE ROUTERS MATTERS - BEWARE.
*/
productRouter.get('/:id', expressAsyncHandler(async (req, res)=>{
    const product = await Product.findById(req.params.id);
    if (product) {
        res.send(product);
    } else {
        res.status(404).send({message:'Product not found'});
    }
}));

export default productRouter;
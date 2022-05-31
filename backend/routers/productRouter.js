import express from "express";
import expressAsyncHandler from "express-async-handler";
import data from "../data.js";
import Product from "../models/productModel.js";
import { isAdmin, isAuth } from '../utils.js';

const productRouter = express.Router();

productRouter.get('/', expressAsyncHandler(async (req, res)=>{    
    const products = await Product.find({}); /** The empty curly brackets as a parameter returns all product */
    res.send(products);
}));

productRouter.get('/seed', expressAsyncHandler(async (req, res)=>{
    //** This is for restart the seed or data at the database */
    //** We need to access to the link to make it happens - http://localhost:5000/api/products/seed */
    //** Notice the port is pointing out to BACKEND = 5000 */

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

productRouter.post('/', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
    const product = new Product({
        name: 'samle name ' + Date.now(),
        image: '/images/p1.jpg',
        price: 0,
        category: 'sample category',
        brand: 'sample brand',
        countInStock: 0,
        rating: 0,
        numReviews: 0,
        description: 'sample description',
    });
    
    const createdProduct = await product.save();
    res.send({ message: 'Product Created', product: createdProduct });
}));

productRouter.put('/:id', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
      const productId = req.params.id;
      const product = await Product.findById(productId);
      if (product) {
        product.name = req.body.name;
        product.price = req.body.price;
        product.image = req.body.image;
        product.category = req.body.category;
        product.brand = req.body.brand;
        product.countInStock = req.body.countInStock;
        product.description = req.body.description;
        const updatedProduct = await product.save();
        res.send({ message: 'Product Updated', product: updatedProduct });
      } else {
        res.status(404).send({ message: 'Product Not Found' });
      }
    })
  );

  productRouter.delete( '/:id', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
      const product = await Product.findById(req.params.id);
      if (product) {
        const deleteProduct = await product.remove();
        res.send({ message: 'Product Deleted', product: deleteProduct });
      } else {
        res.status(404).send({ message: 'Product Not Found' });
      }
    })
  );

export default productRouter;
import React, { useEffect, useState } from 'react';
// import data from '../data'
import Rating from '../components/Rating';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { detailsProduct } from '../actions/productActions';

export default function ProductScreen(props) {
    // const product = data.products.find((x) => x._id === props.match.params.id)
    const dispatch = useDispatch();
    const productId = props.match.params.id;
    const [qty, setQty] = useState(1);
    const productDetails = useSelector(state => state.productDetails);
    const {loading, error, product} = productDetails;

    useEffect(() => {
        dispatch(detailsProduct(productId));
    }, [dispatch, productId]);
    // if(!product){
    //     return <div>Product not found!</div>
    // }

    const addToCartHandler = ()=>{
        props.history.push(`/cart/${productId}?qty=${qty}`);
    };

    return (
        <div>
          {
            loading?(<LoadingBox></LoadingBox>):
            (error?<MessageBox variant="danger">{error}</MessageBox>:
            <div>
            <Link to="/">Back to main</Link>
            <div className="row top">
                <div className="col-2">
                    <img src={product.image} alt={product.name}></img>
                </div>
                <div className="col-1">
                    <ul>
                        <li><h1>{product.name}</h1></li>
                        <li>
                            <Rating rating={product.rating} numReviews={product.numReviews}></Rating>
                        </li>
                        <li>Precio: ${product.price}</li>
                        <li>Descripcion: {product.description}</li>
                    </ul>
                </div>            
                <div className="col-1">
                    <div className="card card-body">
                        <ul>
                        <li>
                            Seller{' '}
                            <h2><Link to={`/seller/${product.seller._id}`}> {product.seller.seller.name}</Link></h2>
                            <Rating rating={product.seller.seller.rating} numReviews={product.seller.seller.numReviews}></Rating>
                        </li>
                        <li>
                            <div className="row">
                                <div>Price&nbsp;</div>
                                <div className="price">${product.price}</div>
                            </div>
                        </li>
                        <li>
                            <div className="row">
                                <div>Estado&nbsp;</div>
                                <div>{
                                product.countInStock > 0 ? (<span className="success">In stock</span>):
                                (<span className="danger">Unavailable</span>)
                                    }
                                </div>
                            </div>
                        </li>
                        {
                            product.countInStock > 0 && (
                                //** Because we need to put 2 elements next to each other we use <>
                                <>
                                <li>
                                <div className="row">
                                    <div>Qty: </div>
                                    <div>
                                        <select value={qty} onChange={(e) => setQty(e.target.value)}>
                                            {
                                                [...Array(product.countInStock).keys()].map(
                                                    x=>(<option key={x+1} value={x+1}>{x+1}</option>)
                                                )
                                            }
                                        </select>
                                    </div>                                    
                                </div>
                                </li>
                                <li><button onClick={addToCartHandler} className="primary block">Add to Cart</button></li>
                                </>
                            ) 
                        }
                        </ul>
                    </div>
                </div>
            </div>            
        </div>
              )
          }
        </div>        
    )
}
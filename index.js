const express = require('express');
const dns = require('node:dns')

const fs = require('fs')
const app = express()

let data =fs.readFileSync('products.json');
let prodData =JSON.parse(data)

app.use(express.json())
const PORT = 7000;

//QUESTION NO. 01

app.post('/getmeip',(req,res)=>{
    const url =req.body.website_name;
    console.log(url)

    dns.lookup(url,(err,address, family)=>{
        console.log('address: %j family: IPv%s', address, family);
        res.send(`${address}`)
    })
})





// Question-2
// get data request
app.get('/products', (req, res) => {
    return res.status(200).send(prodData);
});

// Post Data request
app.post('/products/create',(req,res) => {
    var data = req.body;
    prodData.push(data)
    fs.writeFile("products.json", JSON.stringify(prodData), (err) => {
        if (err) throw err;
    });
    return res.send('product added')
})

// Delete data request
app.delete('/products/:productId',(req,res)=>{
    const { productId } = req.params;
    console.log("id",productId)
    let index = prodData.findIndex(product => product.id == productId);
    if(index == -1){
        return res.status(404).send({
            message: 'Product not found'
        });
    }
    prodData.splice(index, 1);
    fs.writeFile("products.json", JSON.stringify(prodData), (err) => {
        if (err) throw err;
    });
    res.send('product deleted successfully')
})


// update request
app.put('/products/:productId', (req, res) => {
    let id = req.params.productId;
    let index = prodData.findIndex(product => product.id == id);
    if(index == -1){
        return res.status(404).send({
            message: 'Product not found'
        });
    }
    prodData[index] = req.body;
    fs.writeFile("products.json", JSON.stringify(prodData), (err) => {
        if (err) throw err;
    }
    );
    return res.status(200).send({
        message: 'Product updated successfully'
    });
}
);


app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})





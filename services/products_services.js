const faker = require('faker');
const getConnection = require('../libs/postgres');

class ProductsServices {

  constructor(){

  }

  async getAllProducts(){
    const client = await getConnection();
    const responseDB = await client.query('SELECT * FROM products');
    return responseDB.rows;
  }

  // async getProductByName(productName){
  //   // const product = this.products.filter(product => product.name.toLowerCase().includes(productName.toLowerCase()) || product.ref.toLowerCase().includes(productName.toLowerCase()));

  //   if (product) {
  //     return {
  //       message: 'Product by name founded',
  //       data: product
  //     }
  //   }else{
  //     return {message: 'Producto no encontrado... productName: ' + productName};
  //   }
  // }

  // Make DB connection and prepare the response for router to get product by name or ref
  async getProductByName(productName){
    const client = await getConnection();
    const responseDB = await client.query("SELECT * FROM products WHERE LOWER(ref) LIKE $1 or LOWER(name) LIKE $1", ['%' + productName + '%']);

    if (responseDB) {
      return {
        message: 'Product by name founded',
        data: responseDB.rows
      }
    }else{
      return {message: 'Producto no encontrado... productName: ' + productName};
    }
  }

  // getProductById(productId){
  //   const product = this.products.find(product => product.refId === productId);
  //   if (product) {
  //     return {
  //       message: 'Product founded',
  //       data: product
  //     }
  //   }else{
  //     throw new Error('Producto no encontrado... productId: ' + productId);
  //   }
  // }

  async getProductById(productId){
    const client = await getConnection();
    const responseDB = await client.query("SELECT * FROM products WHERE id = $1", [productId]);

    if (responseDB) {
      return {
        message: 'Product founded',
        data: responseDB.rows
      }
    }else{
      throw new Error('Producto no encontrado... productId: ' + productId);
    }
  }

  // async postOneProduct(body){

  //   let productRef = this.products.find(product => product.ref === body.ref);

  //   if (productRef) {
  //     return {
  //       message: 'La referencia ya existe'
  //     }
  //   }else{
  //     let product = {
  //       refId: faker.datatype.uuid(),
  //       ref: body.ref,
  //       name: body.name,
  //       quantity: body.quantity,
  //       cost: body.cost,
  //       price: body.price,
  //       image: body.image
  //     }
  //     if (Object.keys(body).length != 0) {
  //         this.products.push(product);
  //         return {
  //           message: 'Product created successfully',
  //           data: product
  //         }
  //     }else{
  //       throw new Error('Debes poner un body en formato JSON');
  //     }
  //   }
  // }

  async postOneProduct(body){

    const client = await getConnection();

    const getDBProducts = await this.getAllProducts();

    let productRef = getDBProducts.find(product => product.ref === body.ref);
    console.log('Log en el post: ', productRef);

    if (productRef) {
      return {
        message: 'La referencia ya existe'
      }
    }else{

      if (Object.keys(body).length != 0) {
          // this.products.push(product);

          const responseDB = await client.query(`INSERT INTO "products" ("ref", "name", "quantity", "cost", "price", "image")
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`, [body.ref, body.name, body.quantity, body.cost, body.price, body.image]);

          let product = {
            refId: responseDB.rows[0].id,
            ref: body.ref,
            name: body.name,
            quantity: body.quantity,
            cost: body.cost,
            price: body.price,
            image: body.image
          }
          return {
            message: 'Product created successfully',
            data: product
          }
      }else{
        throw new Error('Debes poner un body en formato JSON');
      }
    }
  }

  // patchOneProduct(productId, body){
  //   let index = this.products.findIndex(product => product.refId === productId);
  //   if (index != -1) {
  //     const product = this.products[index];
  //     this.products[index] = {
  //       ...product, //merge data in JSON
  //       ...body //merge data in JSON
  //     };
  //     return {
  //       Message: 'Product updated successfully',
  //       data: {
  //         ...product,
  //         ...body
  //       }
  //     };
  //   }else{
  //     throw new Error('Product: ' + productId + ' not found');
  //   }
  // }

  async patchOneProduct(productId, body){
    const client = await getConnection();
    const getDBProducts = await this.getAllProducts();
    let productForUpdate = getDBProducts.find(product => product.id === parseInt(productId));
    const fieldsToUpdate = {
      ...productForUpdate,
      ...body
    };

    let index = getDBProducts.findIndex(product => product.id === parseInt(productId));
    if (index != -1) {
      const responseDB = await client.query('UPDATE products SET ref = $1, name = $2, quantity = $3, cost = $4, price = $5, image = $6 WHERE id = $7',
        [fieldsToUpdate.ref, fieldsToUpdate.name, fieldsToUpdate.quantity, fieldsToUpdate.cost, fieldsToUpdate.price, fieldsToUpdate.image, parseInt(productId)]);
      return {
        Message: 'Product updated successfully',
        data: fieldsToUpdate

      };
    }else{
      throw new Error('Product: ' + productId + ' not found');
    }
  }

  // deleteProduct(productId){
  //   let product = this.products.find(product => product.refId === productId);
  //   const productIndex = this.products.indexOf(product);
  //   if (product) {
  //     this.products.splice(productIndex, 1);
  //     return {
  //       message: 'Product deleted successfully',
  //       product
  //     }
  //   }else{
  //     return { ErrorMessage: 'Product: ' + productId + ' not found' };
  //   }
  // }

  async deleteProduct(productId){
    const client = await getConnection();
    // const responseDB = await client.query("SELECT * FROM products WHERE id = $1", [parseInt(productId)]);
    const responseDB = await this.getDBById(productId);
    console.log('No se que pasa: ', responseDB);

    if (responseDB) {
      const responseDeleteDB = await client.query('DELETE FROM products WHERE id = $1', [parseInt(productId)]);
      return {
        message: 'Product deleted successfully',
        data: responseDB
      }
    }else{
      return { ErrorMessage: 'Product: ' + productId + ' not found' };
    }
  }

  async getDBById(productId){
    const client = await getConnection();
    const responseDB = await client.query("SELECT * FROM products WHERE id = $1", [parseInt(productId)]);
    return responseDB.rows;
  }

}

module.exports = ProductsServices;

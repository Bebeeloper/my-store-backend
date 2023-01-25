const pool = require('../libs/postgres.pool');

class ProductsServices {

  constructor(){
    this.pool = pool;
    this.pool.on('error', (err) => console.error(err));
  }

  // Get all products from DB
  async getAllProducts(){
    const query = 'SELECT * FROM products ORDER BY id DESC';
    const responseDB = await this.pool.query(query);
    return responseDB.rows;
  }

  // Make DB connection and prepare the response for router to get product by name or ref
  async getProductByName(productName){
    const query = 'SELECT * FROM products WHERE LOWER(ref) LIKE $1 or LOWER(name) LIKE $1 ORDER BY id ASC';
    const array = ['%' + productName + '%'];
    const responseDB = await this.pool.query(query, array);

    if (responseDB.rows.length > 0) {
      return {
        message: 'Product by name founded',
        data: responseDB.rows
      }
    }else{
      return {message: 'Producto no encontrado... productName: ' + productName};
    }
  }

  async getProductById(productId){
    const responseDB = await this.getDBById(productId);

    if (responseDB.length > 0) {
      return {
        message: 'Product founded',
        data: responseDB
      }
    }else{
      throw new Error('Producto no encontrado... productId: ' + productId);
    }
  }

  async postOneProduct(body){
    const query = 'SELECT * FROM products WHERE ref = $1';
    const array = [body.ref];
    const getDBProducts = await this.pool.query(query, array);

    if (getDBProducts.rows.length > 0) {
      return {
        message: 'La referencia ya existe'
      }
    }else{
      if (Object.keys(body).length != 0) {
        const queryUpdate = 'INSERT INTO products (ref, name, quantity, cost, price, image) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
        const arrayUpdate = [body.ref, body.name, body.quantity, body.cost, body.price, body.image];
        const responseDB = await this.pool.query(queryUpdate, arrayUpdate);

        return {
          message: 'Product created successfully',
          data: responseDB.rows
        }
      }else{
        throw new Error('Debes poner un body en formato JSON');
      }
    }
  }

  async patchOneProduct(productId, body){
    const getDBProduct = await this.getDBById(productId);
    let productArray = getDBProduct;
    let productFind = productArray.find(product => product.id === parseInt(productId));

    const fieldsToUpdate = {
      ...productFind,
      ...body
    };

    if (productFind) {
      const query = 'UPDATE products SET ref = $1, name = $2, quantity = $3, cost = $4, price = $5, image = $6 WHERE id = $7';
      const array = [fieldsToUpdate.ref, fieldsToUpdate.name, fieldsToUpdate.quantity, fieldsToUpdate.cost, fieldsToUpdate.price, fieldsToUpdate.image, parseInt(productId)];
      const responseDB = await this.pool.query(query, array);

      return {
        Message: 'Product updated successfully',
        data: fieldsToUpdate
      };
    }else{
      throw new Error('Product: ' + productId + ' not found');
    }
  }

  async deleteProduct(productId){
    const responseDB = await this.getDBById(productId);

    if (responseDB.length > 0) {
      const query = 'DELETE FROM products WHERE id = $1';
      const array = [parseInt(productId)];
      const responseDeleteDB = await this.pool.query(query, array);

      return {
        message: 'Product deleted successfully',
        data: responseDB
      }
    }else{
      return { ErrorMessage: 'Product: ' + productId + ' not found' };
    }
  }

  async getDBById(productId){
    const query = 'SELECT * FROM products WHERE id = $1';
    const array = [parseInt(productId)];
    const responseDB = await this.pool.query(query, array);
    return responseDB.rows;
  }

}

module.exports = ProductsServices;

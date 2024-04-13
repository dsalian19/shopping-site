from flask import Flask, jsonify, request
from flask_cors import CORS
from data import products  

app = Flask(__name__, static_url_path='/static', static_folder='static')
CORS(app)  

@app.route('/api/products', methods=['GET'])
def get_products():
    return jsonify(products)

products_index = {product['id']: product for product in products}
@app.route('/api/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    product = products_index.get(product_id)
    if not product:
        return jsonify({'message': 'Product not found'}), 404
    return jsonify(product)

@app.route('/api/purchase', methods=['POST'])
def purchase_products():
    data = request.json
    product_tally = {}

    # Tally the requested quantities for each product
    for item in data:
        if item['id'] in product_tally:
            product_tally[item['id']] += item['quantity']
        else:
            product_tally[item['id']] = item['quantity']

    # Check if the products have sufficient quantity
    errors = []
    for product_id, requested_quantity in product_tally.items():
        product = next((p for p in products if p['id'] == product_id), None)
        if not product or product['quantity'] < requested_quantity:
            errors.append({
                'id': product_id,
                'error': 'Insufficient quantity' if product else 'Product not found'
            })

    # If any item does not have sufficient stock, return an error
    if errors:
        return jsonify({'errors': errors}), 400

    # Deduct quantities from the stock when successful purchase is made
    for product_id, requested_quantity in product_tally.items():
        product = next((p for p in products if p['id'] == product_id), None)
        if product:
            product['quantity'] -= requested_quantity

    return jsonify({'message': 'Purchase successful'})

if __name__ == '__main__':
    app.run(debug=True, port=8080)

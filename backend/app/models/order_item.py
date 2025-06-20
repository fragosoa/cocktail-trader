from app.extensions import db

class OrderItem(db.Model):
    __tablename__ = 'order_items'
    
    id = db.Column(db.UUID(as_uuid=True), primary_key=True, server_default=db.text('gen_random_uuid()'))
    unit_price = db.Column(db.Float, nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)

    order_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey('orders.id'), nullable=False)
    order = db.relationship('Order', back_populates='items')

    drink_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey('drinks.id'), nullable=False)
    drink = db.relationship('Drink')

    @property
    def subtotal(self):
        return self.unit_price * self.quantity
        
    def to_dict(self):
        return {
            'id': str(self.id),
            'unit_price': self.unit_price,
            'quantity': self.quantity,
            'subtotal': self.subtotal,
            'order_id': str(self.order_id)
        }
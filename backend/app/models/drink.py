from app.extensions import db

class Drink(db.Model):
    __tablename__ = 'drinks'

    id = db.Column(db.UUID(as_uuid=True), primary_key=True, server_default=db.text('gen_random_uuid()'))
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)

    order_items = db.relationship('OrderItem', back_populates='drink', lazy='dynamic')
    price_history = db.relationship('PriceHistory', back_populates='drink', lazy='dynamic')
    
    def __repr__(self):
        return f"<Drink {self.name}>"

    def to_dict(self):
        return {
            'id': str(self.id),
            'name': self.name,
            'price': self.price
        }
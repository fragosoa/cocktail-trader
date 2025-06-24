from app.extensions import db

class PriceHistory(db.Model):
    __tablename__ = 'price_history'

    drink_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey('drinks.id'), nullable=False)
    price = db.Column(db.Float, nullable=False)
    timestamp = db.Column(db.DateTime(timezone=True), server_default=db.func.now(), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)

    drink = db.relationship('Drink', back_populates='price_history')

    __table_args__ = (
        db.PrimaryKeyConstraint('drink_id', 'timestamp'),
    )

    def __repr__(self):
        return f"<PriceHistory drink_id={self.drink_id} price={self.price} timestamp={self.timestamp}>"

    def to_dict(self):
        return {
            'id': self.id,
            'drink_id': str(self.drink_id),
            'price': self.price,
            'timestamp': self.timestamp.isoformat(),
            'quantity': self.quantity
        }
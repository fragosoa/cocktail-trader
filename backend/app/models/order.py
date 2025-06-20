from app.extensions import db

class Order(db.Model):
    __tablename__ = 'orders'
    
    id = db.Column(db.UUID(as_uuid=True), primary_key=True, server_default=db.text('gen_random_uuid()'))
    total_price = db.Column(db.Float, nullable=False, default=0.0)

    table_number = db.Column(db.Integer, db.ForeignKey('tables.number'), nullable=False)
    table = db.relationship('Table', back_populates='orders')

    status = db.Column(db.String(20), nullable=False, default='pending')
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    
    items = db.relationship('OrderItem', back_populates='order', lazy='dynamic')
    
    def calculate_total(self):
        self.total_price = sum(item.subtotal for item in self.items)

    def to_dict(self):
        return {
            'id': str(self.id),
            'status': self.status,
            'created_at': self.created_at.isoformat()
        }
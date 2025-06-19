from app.extensions import db

class Order(db.Model):
    __tablename__ = 'orders'
    
    id = db.Column(db.UUID(as_uuid=True), primary_key=True, server_default=db.text('gen_random_uuid()'))
    #user_id = db.Column(db.UUID, db.ForeignKey('users.id'), nullable=False)
    status = db.Column(db.String(20), nullable=False, default='pending')
    locked_price_used = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    
    #items = db.relationship('OrderItem', backref='order', lazy=True)
    
    def to_dict(self):
        return {
            'id': str(self.id),
            'status': self.status,
            'created_at': self.created_at.isoformat()
        }
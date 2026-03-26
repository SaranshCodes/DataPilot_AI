from backend import db
from datetime import datetime
import json

class TrainingJob(db.Model):
    __tablename__ = 'training_jobs'
    id           = db.Column(db.Integer, primary_key=True)
    job_id       = db.Column(db.String(20), unique=True, nullable=False)
    user_id      = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    filename     = db.Column(db.String(255))
    target_col   = db.Column(db.String(100))
    task_type    = db.Column(db.String(20))
    status       = db.Column(db.String(20), default='queued')
    best_model   = db.Column(db.String(100))
    model_path   = db.Column(db.String(255))
    metrics_json = db.Column(db.Text)
    created_at   = db.Column(db.DateTime, default=datetime.utcnow)
    def set_metrics(self, results_list):
        self.metrics_json = json.dumps(results_list)
    def get_metrics(self):
        return json.loads(self.metrics_json) if self.metrics_json else []
    def to_dict(self):
        return {
            'job_id': self.job_id, 'filename': self.filename,
            'target_col': self.target_col, 'task_type': self.task_type,
            'status': self.status, 'best_model': self.best_model,
            'metrics': self.get_metrics(), 'created_at': self.created_at.isoformat()
        }
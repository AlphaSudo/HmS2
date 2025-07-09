-- Notification Service Database Setup

-- Create notification database
CREATE DATABASE hms_notification_db;

-- Connect to the notification database
\c hms_notification_db;

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id BIGSERIAL PRIMARY KEY,
    recipient_email VARCHAR(255) NOT NULL,
    recipient_phone VARCHAR(50),
    recipient_name VARCHAR(255),
    subject VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    notification_type VARCHAR(50) NOT NULL CHECK (notification_type IN ('EMAIL', 'SMS', 'PUSH', 'IN_APP')),
    status VARCHAR(50) NOT NULL CHECK (status IN ('PENDING', 'SENT', 'DELIVERED', 'FAILED', 'CANCELLED')),
    priority VARCHAR(50) NOT NULL CHECK (priority IN ('LOW', 'NORMAL', 'HIGH', 'URGENT', 'CRITICAL')),
    template_name VARCHAR(255),
    template_variables TEXT,
    sent_at TIMESTAMP,
    delivered_at TIMESTAMP,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    error_message TEXT,
    source_service VARCHAR(255),
    reference_id VARCHAR(255),
    reference_type VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_notifications_recipient_email ON notifications(recipient_email);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_type ON notifications(notification_type);
CREATE INDEX idx_notifications_priority ON notifications(priority);
CREATE INDEX idx_notifications_source_service ON notifications(source_service);
CREATE INDEX idx_notifications_reference ON notifications(reference_id, reference_type);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
CREATE INDEX idx_notifications_retry_pending ON notifications(status, retry_count, max_retries) WHERE status = 'FAILED';

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_notifications_updated_at 
    BEFORE UPDATE ON notifications 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample notification templates (optional)
INSERT INTO notifications (
    recipient_email, 
    recipient_name, 
    subject, 
    content, 
    notification_type, 
    status, 
    priority,
    template_name,
    source_service,
    reference_type
) VALUES 
(
    'admin@hospital.com',
    'System Administrator',
    'Notification Service Started',
    'The notification service has been successfully initialized and is ready to send notifications.',
    'EMAIL',
    'PENDING',
    'NORMAL',
    'system_startup',
    'notification-service',
    'SYSTEM'
) ON CONFLICT DO NOTHING;

-- Grant necessary permissions
GRANT USAGE ON SEQUENCE notifications_id_seq TO postgres;
GRANT ALL PRIVILEGES ON TABLE notifications TO postgres; 
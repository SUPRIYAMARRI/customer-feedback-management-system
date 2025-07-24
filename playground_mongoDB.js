use("supriya");
const Feedback = mongoose.model('Feedback', feedbackSchema); // stores in 'feedbacks'
const QualityFeedback = mongoose.model('QualityFeedback', feedbackSchema, 'quality_feedback');
const SupportFeedback = mongoose.model('SupportFeedback', feedbackSchema, 'support_feedback');
const ServiceFeedback = mongoose.model('ServiceFeedback', feedbackSchema, 'service_feedback');
const DeliveryFeedback = mongoose.model('DeliveryFeedback', feedbackSchema, 'delivery');
// Field configuration for dynamic homepage content forms
// Each section has a list of fields with type, label, and name

export const sectionFieldConfigs = {
  banner: [
    { name: 'title', label: 'Title', type: 'text', required: true },
    { name: 'subtitle', label: 'Subtitle', type: 'text', required: true },
    { name: 'image', label: 'Image', type: 'file', required: true },
  ],
  stats: [
    { name: 'label', label: 'Label', type: 'text', required: true },
    { name: 'value', label: 'Value', type: 'number', required: true },
  ],
  features: [
    { name: 'title', label: 'Title', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'text', required: true },
    { name: 'icon', label: 'Icon', type: 'file', required: false },
  ],
  testimonials: [
    { name: 'name', label: 'Customer Name', type: 'text', required: true },
    { name: 'message', label: 'Feedback', type: 'text', required: true },
    { name: 'avatar', label: 'Avatar', type: 'file', required: false },
  ],
  whyChooseUs: [
    { name: 'title', label: 'Title', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'text', required: true },
    { name: 'icon', label: 'Icon', type: 'file', required: false },
  ],
  faq: [
    { name: 'question', label: 'Question', type: 'text', required: true },
    { name: 'answer', label: 'Answer', type: 'text', required: true },
  ],
};

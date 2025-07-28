import mongoose from 'mongoose'

const aboutSchema = new mongoose.Schema({
  headline: { type: String, required: true },
  subheadline: { type: String },
  sections: [
    {
      icon: { type: String }, // icon name or url
      title: { type: String, required: true },
      description: { type: String, required: true },
    }
  ],
  image: { type: String }, // left image url
  buttonText: { type: String },
  buttonLink: { type: String },
  personalDetails: {
    name: String,
    role: String,
    location: String,
    email: String,
    phone: String,
    birthday: String,
    // add more fields as needed
  },
  interests: [
    {
      icon: String, // icon name for frontend
      label: String
    }
  ],
  skills: [
    {
      name: String,
      level: String, // e.g. 'Expert', 'Intermediate', or percent
      icon: String
    }
  ],
  experiences: [
    {
      company: String,
      role: String,
      period: String,
      description: String
    }
  ],
  achievements: [
    {
      title: String,
      description: String,
      icon: String
    }
  ],
  socialLinks: [
    {
      platform: String,
      url: String,
      icon: String
    }
  ]
}, { timestamps: true })

const About = mongoose.models.About || mongoose.model('About', aboutSchema)
export default About

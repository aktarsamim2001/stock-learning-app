import About from '../models/aboutModel.js'

// Get About content
export const getAbout = async (req, res) => {
  try {
    const about = await About.findOne().sort({ updatedAt: -1 })
    if (!about) return res.status(404).json({ message: 'About content not found' })
    res.json(about)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Update About content (admin only)
export const updateAbout = async (req, res) => {
  try {
    const {
      headline,
      subheadline,
      sections,
      image,
      buttonText,
      buttonLink,
      personalDetails,
      interests,
      skills,
      experiences,
      achievements,
      socialLinks
    } = req.body
    let about = await About.findOne()
    if (!about) {
      about = new About({
        headline,
        subheadline,
        sections,
        image,
        buttonText,
        buttonLink,
        personalDetails,
        interests,
        skills,
        experiences,
        achievements,
        socialLinks
      })
    } else {
      about.headline = headline
      about.subheadline = subheadline
      about.sections = sections
      about.image = image
      about.buttonText = buttonText
      about.buttonLink = buttonLink
      about.personalDetails = personalDetails
      about.interests = interests
      about.skills = skills
      about.experiences = experiences
      about.achievements = achievements
      about.socialLinks = socialLinks
    }
    await about.save()
    res.json(about)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const Profile = require('../Models/ProfileModel');
const User = require('../Models/UsersModel');
const validator = require('validator');



exports.getMyProfile = async (req, res, next) => {
    
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);

        if (!profile) {
            return res.status(400).json({
                message: 'there is no profile for this user'
            })          
        }
         res.status(200).json({
            success: true,
            data: {
                profile
            }
         })


    } catch (err) {
    //   console.log(err)
      res.status(500).send('Server error getting your profile!!')
    }
}



exports.createProfile = async (req, res, next) => {
    
    if (!req.body.status || validator.isEmpty(req.body.status)) {
        return res.status(400).json({
            msg: 'status is Required'
        })
    } else if (!req.body.skills || validator.isEmpty(req.body.skills)) {
            return res.status(400).json({
                msg: 'skills is Required'
            })
    }

    const { company, website, location, status, skills, bio, githubusername, youtube, twitter, facebook, instagram, linkedIn } = req.body;

    let profileFields = {};
    profileFields.socials = {};

    profileFields.user = req.user.id;
    if (company) profileFields.company = company; 
    if (website) profileFields.website = website; 
    if (location) profileFields.location = location; 
    if (bio) profileFields.bio = bio; 
    if (status) profileFields.status = status; 
    if (githubusername) profileFields.githubusername = githubusername; 
    
    if (skills) {
        profileFields.skills = skills.split(',')
    }
    if (facebook) profileFields.socials.facebook = facebook; 
    if (youtube) profileFields.socials.youtube = youtube; 
    if (twitter) profileFields.socials.twitter = twitter; 
    if (instagram) profileFields.socials.instagram = instagram; 
    if (linkedIn) profileFields.socials.linkedIn = linkedIn; 
    

    try {
      let profile = await Profile.findOne({ user: req.user.id })

      if (profile) {
        profile = await Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileFields },
            { new: true })

            return res.status(201).json({
                success: true,
                profile
            })
        }
        
        profile = await Profile.create(profileFields)
        
        res.status(200).json({
            success: true,
            profile
        })
        
        
    } catch (err) {
        // console.log(err);
        res.status(500).send('Server error creating Profile')
    }
}


exports.getAllProfiles = async (req, res, next) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar'])

        res.status(200).json({
            success: true,
            profiles
        })

    } catch (err) {
        // console.log(err);
        res.status(500).send('Server error Getting all Profiles')

    }
}


exports.deleteProfileUserPosts = async (req, res, next) => {
    try {
        
        await Profile.findOneAndRemove({ user: req.user.id });
        
        await User.findOneAndRemove({ _id: req.user.id });
        

        res.status(204).json({
            success: true,
            msg: 'Data Is successFully removed'
        })

    } catch (err) {
        // console.log(err);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({
                message: 'No profile found !'
            })
        } else {
            return res.status(500).send('Server error Getting all Profiles')
        }

    }
}


exports.getProfileByUserId = async (req, res, next) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar'])

        if (!profile) {
            return res.status(400).json({
                message: 'No profile found !'
            })
          
        }

        res.status(200).json({
            success: true,
            profile
        })

    } catch (err) {
        // console.log(err);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({
                message: 'No profile found !'
            })
        } else {
            return res.status(500).send('Server error Getting all Profiles')
        }

    }
}


exports.createExperience = async (req, res, next) => {

    if (!req.body.title || validator.isEmpty(req.body.title)) {
        return res.status(400).json({
            msg: 'title is Required'
        })

    } else if (!req.body.company || validator.isEmpty(req.body.company)) {
            return res.status(400).json({
                msg: 'company is Required'
            })

    } else if (!req.body.from || validator.isEmpty(req.body.from)) {
            return res.status(400).json({
                msg: 'from is Required'
            })

    }

    const { title, company, location, from, to, current, description, website } = req.body

    let newExperience = {
        title,
        company,
        location,
        from,
        to,
        current,
        description,
        website
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id})
        if (!profile) {
            res.status(400).json({
                message: 'No profile found !'
            })
        }

        profile.experience.unshift(newExperience);
        // profile.experience.pop()
        
        await profile.save()

        res.status(201).json({
            success: true,
            profile
        })

    } catch (err) {
    //   console.log(err);
      res.status(500).send('Server error creating experiences !!')
    }
    
}


exports.deleteExperienceById = async (req, res, next) => {
    try {
      const profile = await Profile.findOne({ user: req.user.id})
      if (!profile) {
        res.status(400).json({
            success: false,
            msg: "profile not found"
        })
      }
      
      const filteredexp = profile.experience.filter(item => {
          return item._id == req.params.id
      })


      profile.experience.splice(filteredexp[0], 1)
    //   console.log(profile.experience)

      await profile.save()

      res.status(200).json({
        success: true,
        profile
    })

    } catch (err) {
        // console.log(err)
        res.status(500).send('Server error deleting experience by id !!')
    }
}



exports.createEducation = async (req, res, next) => {

    if (!req.body.institute || validator.isEmpty(req.body.institute)) {
        return res.status(400).json({
            msg: 'institute is Required'
        })

    } else if (!req.body.degree || validator.isEmpty(req.body.degree)) {
            return res.status(400).json({
                msg: 'degree is Required'
            })

    } else if (!req.body.fieldofstudy || validator.isEmpty(req.body.fieldofstudy)) {
            return res.status(400).json({
                msg: 'field of study is Required'
            })

    } else if (!req.body.from || validator.isEmpty(req.body.from)) {
            return res.status(400).json({
                msg: 'from is Required'
            })

    }

    const { institute, degree, fieldofstudy, from, to, current, description } = req.body

    let newEducation = { institute, degree, fieldofstudy, from, to, current, description };

    try {
      const profile = await Profile.findOne({ user: req.user.id})
        if (!profile) {
            res.status(400).json({
                message: 'No profile found !'
            })
        }

        profile.education.unshift(newEducation);
        // profile.experience.pop()
        
        await profile.save()

        res.status(201).json({
            success: true,
            profile
        })

    } catch (err) {
    //   console.log(err);
      res.status(500).send('Server error creating Education !!')
    }
    
}



exports.deleteEducationById = async (req, res, next) => {
    try {
      const profile = await Profile.findOne({ user: req.user.id})
      if (!profile) {
        res.status(400).json({
            success: false,
            msg: "profile not found"
        })
      }
      
      const filteredexp = profile.education.filter(item => {
          return item._id == req.params.id
      })


      profile.education.splice(filteredexp[0], 1)
    //   console.log(profile.experience)

      await profile.save()

      res.status(200).json({
        success: true,
        profile
    })

    } catch (err) {
        // console.log(err)
        res.status(500).send('Server error deleting education by id !!')
    }
}


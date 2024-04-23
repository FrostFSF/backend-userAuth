import mongoose from 'mongoose';


let profile_imgs_name_list = ["Garfield", "Tinkerbell", "Annie", "Loki", "Cleo", "Angel", "Bob", "Mia", "Coco", "Gracie", "Bear", "Bella", "Abby", "Harley", "Cali", "Leo", "Luna", "Jack", "Felix", "Kiki"];
let profile_imgs_collections_list = ["notionists-neutral", "adventurer-neutral", "fun-emoji"];


let userSchema = mongoose.Schema({

    personal_info: {
        fullname: {
            type: String,
            minlength: [3, "Full name must be atleast 3 characters long"],
            required: true
        },
        email: {
            type: String,
            unique: true,
            required: true
        },
        password: String,
        username: {
            type: String,
            unique: true,
            reuqired: true
        },
        bio: {
            type: String,
            maxlength: [200, "Bio must not exceed the limit of 200 characters"],
            default: ""
        },
        profile_img: {
            type: String,
            default: () => {
                return `https://api.dicebear.com/6.x/${profile_imgs_collections_list[Math.floor(Math.random() * profile_imgs_collections_list.length)]}/svg?seed=${profile_imgs_name_list[Math.floor(Math.random() * profile_imgs_name_list.length)]}`
            }
        }
    },
    social_links: {
        google: {
            type: String,
            default: ""
        },
        facebook: {
            type: String,
            default: ""
        },
        instagram: {
            type: String,
            default: ""
        },
        youtube: {
            type: String,
            default: ""
        },
        twitter: {
            type: String,
            default: ""
        }
    },
    account_info: {
        total_posts: {
            type: Number,
            default: 0
        },
        total_likes: {
            type: Number,
            default: 0
        },
        total_followings: {
            type: Number,
            default: 0
        },
        total_followers: {
            type: Number,
            default: 0
        }
    }
},
    {
        timestamps: {
            createdAt: 'joinedAt'
        }
    }
);

export default mongoose.model("users", userSchema);

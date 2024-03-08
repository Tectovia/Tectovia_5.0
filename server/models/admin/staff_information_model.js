const mongoose = require("mongoose");
const { isNullOrUndefined } = require("util");


const staff =new mongoose.Schema({
  staff_id: {
    type: String,
  },

  staff_profile_img: {
    type: String,
  },

  staff_password: {
    type: String,
  },

  staff_name: {
    type: String,
  },

  class_incharge: {
    type: String,
    default:null
  },
  forum_incharge: {
    type: String,
    default:null
  },
  staff_designation: {
    type:String,
  },

  staff_father: {
    type: String,
  },
  staff_mother: {
    type: String,
  },
  staff_marrital: {
    type: String,
  },
  staff_mr_mrs: {
    type: String,
  },

  staff_gender: {
    type: String,
  },
  staff_qualifiaction: {
    type: String,
  },
  staff_blood: {
    type: String,
  },
  staff_dob: {
    type: String,
  },
  staff_aadhar_no: {
    type: Number,
  },
  staff_aadhar_img: {
    type: String,
  },
  staff_voter_id: {
    type: String,
  },
  staff_pan: {
    type: String,
  },
  staff_community_img: {
    type: String,
  },
  staff_income_img: {
    type: String,
  },
  staff_nationality: {
    type: String,
  },
  staff_disability: {
    type: String,
  },

  staff_disability_img: {
    type: String,
  },

  staff_mobile: {
    type: Number,
  },
  staff_whatsapp: {
    type: Number,
  },
  staff_off_mail: {
    type: String,
  },
  staff_per_mail: {
    type: String,
  },
  staff_per_address: {
    type: String,
  },
  staff_temp_address: {
    type: String,
  },
  staff_experience: {
    type: String,
  },
  staff_experience_img: {
    type: String,
  },
  staff_account_no: {
    type: String,
  },
  staff_accountholder_name: {
    type: String,
  },
  staff_bank_name: {
    type: String,
  },
  staff_bank_branch: {
    type: String,
  },
  staff_account_ifsc: {
    type: String,
  },
  staff_account_passbook: {
    type: String,
  },
  staff_social_media1: {
    type: String,
  },
  staff_social_media2: {
    type: String,
  },
  staff_sslc_mark: {
    type: Number,
  },
  staff_sslc_per: {
    type: String,
  },
  staff_sslc_school: {
    type: String,
  },
  staff_sslc_marksheet: {
    type: String,
  },
  staff_hsc_mark: {
    type: Number,
  },
  staff_hsc_per: {
    type: String,
  },
  staff_hsc_school: {
    type: String,
  },
  staff_hsc_marksheet: {
    type: String,
  },
  staff_ug_mark: {
    type: Number,
  },
  staff_ug_per: {
    type: String,
  },
  staff_ug_college: {
    type: String,
  },
  staff_ug_marksheet: {
    type: String,
  },
  staff_pg_mark: {
    type: Number,
  },
  staff_pg_per: {
    type: String,
  },
  staff_pg_college: {
    type: String,
  },
  staff_pg_marksheet: {
    type: String,
  },
  staff_bed: {
    type: String,
  },
  staff_bed_mark: {
    type: Number,
  },

  staff_bed_college: {
    type: String,
  },
  staff_bed_marksheet: {
    type: String,
  },
  staff_med: {
    type: String,
  },
  staff_med_mark: {
    type: Number,
  },

  staff_med_college: {
    type: String,
  },
  staff_med_marksheet: {
    type: String,
  },

  staff_mpill: {
    type: String,
  },
  staff_mpill_mark: {
    type: Number,
  },

  staff_mpill_university: {
    type: String,
  },
  staff_mpill_marksheet: {
    type: String,
  },
  staff_phd: {
    type: String,
  },

  staff_phd_university: {
    type: String,
  },
  staff_add_pg1: {
    type: String,
  },

  staff_add_pg1_mark: {
    type: Number,
  },
  staff_add_pg1_per: {
    type: String,
  },
  staff_add_pg1_college: {
    type: String,
  },
  staff_add_pg1_marksheet: {
    type: String,
  },
  staff_add_pg2: {
    type: String,
  },

  staff_add_pg2_mark: {
    type: Number,
  },
  staff_add_pg2_per: {
    type: String,
  },
  staff_add_pg2_college: {
    type: String,
  },
  staff_add_pg2_marksheet: {
    type: String,
  },
  staff_diplamo1: {
    type: String,
  },

  staff_diplamo1_mark: {
    type: Number,
  },
  staff_diplamo1_per: {
    type: String,
  },
  staff_diplamo1_college: {
    type: String,
  },
  staff_diplamo1_marksheet: {
    type: String,
  },
  staff_diplamo2: {
    type: String,
  },

  staff_diplamo2_mark: {
    type: Number,
  },
  staff_diplamo2_per: {
    type: String,
  },
  staff_diplamo2_college: {
    type: String,
  },
  staff_diplamo2_marksheet: {
    type: String,
  },
  staff_skill: {
    type: String,
  },
  staff_language: {
    type: String,
  },
  staff_achievement: {
    type: String,
  },
  staff_achievement_img1: {
    type: String,
  },
  staff_achievement_img2: {
    type: String,
  },
  available:{
    type:Boolean,
    default:true
  },

  time_table: {
    day1: [
      {
        sub: String,
        class: String,
        sec: String,
      },
    ],
    day2: [
      {
        sub: String,
        class: String,
        sec: String,
      },
    ],
    day3: [
      {
        sub: String,
        class: String,
        sec: String,
      },
    ],
    day4: [
      {
        sub: String,
        class: String,
        sec: String,
      },
    ],
    day5: [
      {
        sub: String,
        class: String,
        sec: String,
      },
    ],
    day6: [
      {
        sub: String,
        class: String,
        sec: String,
      },
    ],
  },
});

const staff_model=mongoose.model('staff_list',staff);

module.exports = staff_model;

const mongoose = require("mongoose");
const inventoryModel = require("../models/inventoryModel");
const userModel = require("../models/userModel");

//CREATE INVENTORY
const creatInventoryController = async (req, res) => {
  try {
    const { email } = req.body;
    //validation
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new Error("USER NOT FOUND");
    }
    // if (inventoryType === 'in' && user.role !== 'donar') {
    //     throw new Error('NOT A USER ACCOUNT');
    // }
    // if (inventoryType === 'out' && user.role !== 'hospital') {
    //     throw new Error('NOT A HOSPTAL ACCOUNT');
    // }

    if (req.body.inventoryType == "out") {
      const requestedBloodGroup = req.body.bloodGroup;
      const requestedQuantityOfBlood = req.body.quantity;
      const organization = new mongoose.Types.ObjectId(req.body.userId);
      //calculate blood quantity
      const totalInOfRequestedBlood = await inventoryModel.aggregate([
        {
          $match: {
            organization,
            inventoryType: "in",
            bloodGroup: requestedBloodGroup,
          },
        },

        {
          $group: {
            _id: "$bloodGroup",
            total: { $sum: "$quantity" },
          },
        },
      ]);
      //   console.log("Total In ", totalInOfRequestedBlood);
      const totalIn = totalInOfRequestedBlood[0]?.total || 0;

      // calculate out blood quantity
      const totalOutOfRequestedBloodGroup = await inventoryModel.aggregate([
        {
          $match: {
            organization,
            inventoryType: "out",
            bloodGroup: requestedBloodGroup,
          },
        },
        {
          $group: {
            _id: "$bloodGroup",
            total: { $sum: "$quantity" },
          },
        },
      ]);
      const totalOut = totalOutOfRequestedBloodGroup[0]?.total || 0;

      //in & out calc
      const availableQuantityOfBloodGroup = totalIn - totalOut;

      // quantity validation
      if (availableQuantityOfBloodGroup < requestedQuantityOfBlood) {
        return res.status(500).send({
          success: false,
          message: `Only ${availableQuantityOfBloodGroup}ML of ${requestedBloodGroup.toUpperCase()} is available`,
        });
      }
      req.body.hospital = user?._id;
    } else {
      req.body.donar = user?._id;
    }

    //SAVE RECORD
    const inventory = new inventoryModel(req.body);
    await inventory.save();
    return res.status(201).send({
      success: true,
      message: "NEW BLOOD RECORD ADDED",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "ERROR IN CREATING INVENTORY",
      error,
    });
  }
};

//get all blood records
const getInventoryController = async (req, res) => {
  try {
    const inventory = await inventoryModel
      .find({
        organization: req.body.userId,
      })
      .populate("donar")
      .populate("hospital")
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      message: "get all records successfully",
      inventory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "ERROR IN GETTING ALL INVENTORY",
      error,
    });
  }
};
//get all blood records
const getInventoryHospitalController = async (req, res) => {
  try {
    const inventory = await inventoryModel
      .find(req.body.filters)
      .populate("donar")
      .populate("hospital")
      .populate("organization")
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      message: "get hospital consumer records successfully",
      inventory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "ERROR IN GETTING consumer INVENTORY",
      error,
    });
  }
};
// GET BLOOD RECORD OF 3
const getRecentInventoryController = async (req, res) => {
  try {
    const inventory = await inventoryModel
      .find({
        organization: req.body.userId,
      })
      .limit(3)
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      message: "recent Invenotry Data",
      inventory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Recent Inventory API",
      error,
    });
  }
};
//GET DONAR RECORDS
const getDonarsController = async (req, res) => {
  try {
    const organization = req.body.userId;
    //find donas
    const donarId = await inventoryModel.distinct("donar", {
      organization,
    });

    // console.log(donarId);
    const donars = await userModel.find({ _id: { $in: donarId } });

    return res.status(200).send({
      success: true,
      message: "Donor Record Fatched Successfully",
      donars,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in donar Records",
      error,
    });
  }
};

const getHospitalsController = async (req, res) => {
  try {
    const organization = req.body.userId;
    //get hospitalid
    const hospitalId = await inventoryModel.distinct("hospital", {
      organization,
    });

    //find hospital
    const hospitals = await userModel.find({
      _id: { $in: hospitalId },
    });
    return res.status(200).send({
      success: true,
      message: "Hospital data fatched successfully",
      hospitals,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in Hospital API",
      error,
    });
  }
};

// Get Organization Profiles

const getOrganizationController = async (req, res) => {
  try {
    const donar = req.body.userId
    const orgId = await inventoryModel.distinct('organization', { donar })

    //find org

    const organizations = await userModel.find({
      _id: { $in: orgId }
    })

    return res.status(200).send({
      success: true,
      message: 'ORG data fetched successfully',
      organizations,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success: false,
      message: 'Error in ORG API',
      error,
    })
  }
}

// GET ORG FOR HOSPITAL
const getOrganizationForHospitalController = async (req, res) => {
  try {
    const hospital = req.body.userId
    const orgId = await inventoryModel.distinct('organization', { hospital })

    //find org

    const organizations = await userModel.find({
      _id: { $in: orgId }
    })

    return res.status(200).send({
      success: true,
      message: 'Hospital ORG data fetched successfully',
      organizations,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success: false,
      message: 'Error in Hospital ORG API',
      error,
    })
  }
}

module.exports = {
  creatInventoryController,
  getInventoryController,
  getDonarsController,
  getHospitalsController,
  getOrganizationController,
  getOrganizationForHospitalController,
  getInventoryHospitalController,
  getRecentInventoryController
};

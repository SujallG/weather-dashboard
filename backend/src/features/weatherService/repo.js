import City from "./schema.js"

class CityRepository {
  async create(cityData) {
    try {
      const city = new City(cityData);
      return await city.save();
    } catch (error) {
      throw error;
    }
  }

  async findByUserId(userId) {
    try {
      return await City.find({ userId, isActive: true })
        .sort({ displayOrder: 1 })
        .exec();
    } catch (error) {
      throw error;
    }
  }

  async findById(id) {
    try {
      return await City.findOne({ _id: id, isActive: true }).exec();
    } catch (error) {
      throw error;
    }
  }

  async findByIdAndUser(id, userId) {
    try {
      return await City.findOne({ _id: id, userId, isActive: true }).exec();
    } catch (error) {
      throw error;
    }
  }

  async update(id, userId, updateData) {
    try {
      return await City.findOneAndUpdate(
        { _id: id, userId },
        updateData,
        { new: true, runValidators: true }
      ).exec();
    } catch (error) {
      throw error;
    }
  }

  async delete(id, userId) {
    try {
      return await City.findOneAndUpdate(
        { _id: id, userId },
        { isActive: false },
        { new: true }
      ).exec();
    } catch (error) {
      throw error;
    }
  }

  async updateDisplayOrder(userId, cityOrders) {
    try {
      const operations = cityOrders.map(({ id, order }) => ({
        updateOne: {
          filter: { _id: id, userId },
          update: { displayOrder: order }
        }
      }));
      
      return await City.bulkWrite(operations);
    } catch (error) {
      throw error;
    }
  }
}

const cityRepo = new CityRepository();
export default cityRepo;
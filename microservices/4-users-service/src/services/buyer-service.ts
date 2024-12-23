import { BadRequestError, IBuyerDocument } from '@shanisharrma/hustlr-shared';
import { BuyerModel } from '@users/models/buyer-model';

const getBuyerByEmail = async (email: string): Promise<IBuyerDocument | null> => {
  const buyer: IBuyerDocument | null = await BuyerModel.findOne({ email }).exec();
  return buyer;
};

const getBuyerByUsername = async (username: string): Promise<IBuyerDocument | null> => {
  const buyer: IBuyerDocument | null = await BuyerModel.findOne({ username }).exec();
  return buyer;
};

const getRandomBuyers = async (count: number): Promise<IBuyerDocument[]> => {
  const buyers: IBuyerDocument[] = await BuyerModel.aggregate([{ $sample: { size: count } }]);
  return buyers;
};

const createBuyer = async (buyerData: IBuyerDocument): Promise<void> => {
  const buyerExists: IBuyerDocument | null = await getBuyerByEmail(`${buyerData.email}`);
  if (buyerExists) {
    throw new BadRequestError('Buyer already exists with this email', 'buyerService createBuyer() emthod error');
  }
  await BuyerModel.create(buyerData);
};

const updateBuyerIsSellerProp = async (email: string): Promise<void> => {
  await BuyerModel.updateOne(
    { email },
    {
      $set: { isSeller: true }
    }
  ).exec();
};

const updateBuyerPurchasedGigsProp = async (buyerId: string, purchasedGigId: string, type: string): Promise<void> => {
  await BuyerModel.updateOne(
    { _id: buyerId },
    type === 'purchased-gigs'
      ? { $push: { purchasedGigs: purchasedGigId } }
      : { $pull: { purchasedGigs: purchasedGigId } }
  ).exec();
};

export {
  getBuyerByEmail,
  getBuyerByUsername,
  getRandomBuyers,
  createBuyer,
  updateBuyerIsSellerProp,
  updateBuyerPurchasedGigsProp
};

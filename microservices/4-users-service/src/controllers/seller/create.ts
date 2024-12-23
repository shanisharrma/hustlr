import { BadRequestError, ISellerDocument } from '@shanisharrma/hustlr-shared';
import { sellerSchema } from '@users/schemas/seller-schema';
import { createSeller, getSellerByEmail } from '@users/services/seller-service';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const seller = async (req: Request, res: Response): Promise<void> => {
  const { error } = await Promise.resolve(sellerSchema.validate(req.body));
  if (error?.details) {
    throw new BadRequestError(error.details[0].message, 'Create seller() method error');
  }

  const sellerExists: ISellerDocument | null = await getSellerByEmail(req.body.email);
  if (sellerExists) {
    throw new BadRequestError('Seller already exists. Login to your account.', 'Create seller() method error');
  }

  const seller: ISellerDocument = {
    profilePublicId: req.body.profilePublicId,
    fullName: req.body.fullName,
    username: req.body.username,
    email: req.body.email,
    profilePicture: req.body.profilePicture,
    description: req.body.description,
    oneliner: req.body.oneliner,
    country: req.body.description,
    skills: req.body.skills,
    languages: req.body.languages,
    responseTime: req.body.responseTime,
    experience: req.body.experience,
    education: req.body.education,
    socialLinks: req.body.socialLinks,
    certificates: req.body.certificates
  };

  const createdSeller: ISellerDocument = await createSeller(seller);
  res.status(StatusCodes.CREATED).json({ message: 'Seller account created successfully.', seller: createdSeller });
};

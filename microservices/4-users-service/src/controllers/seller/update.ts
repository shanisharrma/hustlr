import { BadRequestError, ISellerDocument } from '@shanisharrma/hustlr-shared';
import { sellerSchema } from '@users/schemas/seller-schema';
import { updateSeller } from '@users/services/seller-service';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const seller = async (req: Request, res: Response): Promise<void> => {
  const { error } = await Promise.resolve(sellerSchema.validate(req.body));
  if (error?.details) {
    throw new BadRequestError(error.details[0].message, 'Update seller() method error');
  }

  const seller: ISellerDocument = {
    profilePublicId: req.body.profilePublicId,
    fullName: req.body.fullName,
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

  const updatedSeller: ISellerDocument = await updateSeller(req.params.sellerId, seller);
  res.status(StatusCodes.OK).json({ message: 'Seller account created successfully.', seller: updatedSeller });
};
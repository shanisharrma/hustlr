import { gerDocumentCount } from '@gig/elasticsearch';
import { gigCreateSchema } from '@gig/schemas/gig-schema';
import { createGig } from '@gig/services/gig-service';
import { BadRequestError, ISellerGig, uploads } from '@shanisharrma/hustlr-shared';
import { UploadApiResponse } from 'cloudinary';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const gigCreate = async (req: Request, res: Response): Promise<void> => {
  const { error } = await Promise.resolve(gigCreateSchema.validate(req.body));
  if (error?.details) {
    throw new BadRequestError(error.details[0].message, 'Create gig() method error');
  }
  const result: UploadApiResponse = (await uploads(req.body.coverImage)) as UploadApiResponse;
  if (!result.public_id) {
    throw new BadRequestError('File upload error. Try again...', 'Create gig() method error');
  }

  const gigCount: number = await gerDocumentCount('gigs');
  const gig: ISellerGig = {
    sellerId: req.body.sellerId,
    username: req.body.username,
    email: req.body.email,
    profilePicture: req.body.profilePicture,
    title: req.body.title,
    description: req.body.description,
    basicTitle: req.body.basicTitle,
    basicDescription: req.body.basicDescription,
    categories: req.body.categories,
    subCategories: req.body.subCategories,
    price: req.body.price,
    tags: req.body.tags,
    expectedDelivery: req.body.expectedDelivery,
    coverImage: `${result.secure_url}`,
    sortId: gigCount + 1
  };

  const createdGig: ISellerGig = await createGig(gig);
  res.status(StatusCodes.CREATED).json({ message: 'Gig created successfully.', gig: createdGig });
};

export { gigCreate };

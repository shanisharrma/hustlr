import { faker } from '@faker-js/faker';
import { BadRequestError, IBuyerDocument, IEducation, IExperience, ISellerDocument } from '@shanisharrma/hustlr-shared';
import { getRandomBuyers } from '@users/services/buyer-service';
import { createSeller, getSellerByEmail } from '@users/services/seller-service';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { floor, random, sample, sampleSize } from 'lodash';
import { v4 as uuidv4 } from 'uuid';

export const seedSeller = async (req: Request, res: Response): Promise<void> => {
  const { count } = req.params;
  const buyers: IBuyerDocument[] = await getRandomBuyers(parseInt(count, 10));
  for (let i = 0; i < buyers.length; i++) {
    const buyer: IBuyerDocument = buyers[i];
    const sellerExists: ISellerDocument | null = await getSellerByEmail(buyer.email!);
    if (sellerExists) {
      throw new BadRequestError('Seller already exists.', 'SellerSeed seller() method error');
    }
    const basicDescription: string = faker.commerce.productDescription();
    const skills: string[] = [
      'Programming',
      'Web Developemnt',
      'Proof Reading',
      'UI/UX',
      'Data Science',
      'Financial Modeling',
      'Data Analysis'
    ];
    const sellers: ISellerDocument = {
      profilePublicId: uuidv4(),
      fullName: faker.person.fullName(),
      username: buyer.username,
      email: buyer.email,
      profilePicture: buyer.profilePicture,
      country: faker.location.country(),
      description: basicDescription.length <= 250 ? basicDescription : basicDescription.slice(0, 250),
      oneliner: faker.word.words({ count: { min: 5, max: 10 } }),
      skills: sampleSize(skills, sample([2, 5])),
      languages: [
        { language: 'English', level: 'Native' },
        { language: 'Spanish', level: 'Basic' },
        { language: 'French', level: 'Basic' }
      ],
      responseTime: parseInt(faker.commerce.price({ min: 1, max: 5, dec: 0 })),
      experience: randomExperiences(parseInt(faker.commerce.price({ min: 2, max: 4, dec: 0 }))),
      education: randomEducation(parseInt(faker.commerce.price({ min: 2, max: 4, dec: 0 }))),
      socialLinks: ['https://kickchatapp.com', 'http://youtube.com', 'https://facebook.com'],
      certificates: [
        {
          name: 'Flutter App Developer',
          from: 'Flutter Academy',
          year: 2021
        },
        {
          name: 'Android App Developer',
          from: 'Coursera',
          year: 2020
        },
        {
          name: 'IOS App Developer',
          from: 'Apple Inc',
          year: 2019
        }
      ]
    };

    await createSeller(sellers);
  }
  res.status(StatusCodes.CREATED).json({ message: 'Sellers created successfully.' });
};

const randomExperiences = (count: number): IExperience[] => {
  const result: IExperience[] = [];
  for (let i = 0; i < count; i++) {
    const randomStartYear = [2019, 2020, 2021, 2022, 2023, 2024];
    const randomEndYear = ['Present', '2022', '2023', '2024'];
    const endYear = randomEndYear[floor(random(0.9) * randomEndYear.length)];
    const experience = {
      company: faker.company.name(),
      title: faker.person.jobTitle(),
      description: faker.commerce.productDescription().slice(0, 100),
      startDate: `${faker.date.month()} ${randomStartYear[floor(random(0.9) * randomStartYear.length)]}`,
      endDate: endYear === 'Present' ? 'Present' : `${faker.date.month()} ${endYear}`,
      currentlyWorkingHere: endYear === 'Present'
    };
    result.push(experience);
  }

  return result;
};

const randomEducation = (count: number): IEducation[] => {
  const result: IEducation[] = [];
  for (let i = 0; i < count; i++) {
    const randomYear = [2019, 2020, 2021, 2022, 2023, 2024];
    const education = {
      country: faker.location.country(),
      university: faker.person.jobTitle(),
      title: faker.person.jobTitle(),
      major: `${faker.person.jobArea()} ${faker.person.jobDescriptor()}`,
      year: `${randomYear[floor(random(0.9) * randomYear.length)]}`
    };
    result.push(education);
  }

  return result;
};

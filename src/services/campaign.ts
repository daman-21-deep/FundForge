import type { Campaign } from '../types';

const DEFAULT_CAMPAIGNS: Campaign[] = [
  {
    id: 'camp_1',
    title: 'AeroGarden X-1',
    description: 'A highly detailed futuristic vertical forest city vertical farming structure inside a research facility. Clean, vertical hydroponics.',
    creator: 'Stellar Labs',
    category: 'TECH',
    targetAmount: 500000,
    currentAmount: 375000,
    daysLeft: 10,
    durationDays: 30,
    status: 'active',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeta45FUlyVoEJxPlQAgmrxEFLv6CzBTRFZX4EpmcHAC7p-pMjvY7tj9TNoLgFa9-8G2t2IF_V5WNK6uU4oS_yYOTWHT1j1fZttyZ8uHg3zjVY1ZeQNktM1z4UvRDLADBY3ZSEaxQ7VTxxBJnrqwTDUqQvME5Kp1Ht30RqVFwtB3xC6CuyyaKz1r_-odFr40-jGJ4Kx15em1LT13TSEjkz1TCPhqKFjXBVwLpZv-V5jSND2ZlFSiD4Ng',
    backersCount: 521,
    contractAddress: 'CC4A2E7B5F6D7C8D9E1F2A3B4C5D6E7F8A9B0C1D2E3F4A5B6C7D8E9F',
  },
  {
    id: 'camp_2',
    title: 'EcoStride Core',
    description: 'Minimalist sustainable sneakers made from recycled ocean plastic. High end textures and clean aesthetics.',
    creator: 'EcoThread Collective',
    category: 'IMPACT',
    targetAmount: 200000,
    currentAmount: 84000,
    daysLeft: 18,
    durationDays: 30,
    status: 'active',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4hI4fvZDReZXb-lWklojoM3mvLBy1mXnzb-h-iTp1A_bMGTKzQttP7VF88lEn18GEWJAuuLyDha6IUEFbT4pWV4BHufqzqUhSKGxkcbjybtZ3sK8MdcfpdGWSh0ISAE17_7M42LNKiVF4qsz8bWG5EYDiC9wR8V-RBCkRJ8SOU3JomYzA5b7xNWNWq1rO7sUPLbevcdqfTU7Z9mYoHy7L3zMDbnxbvQqcirp5lRIQfLy99Mu7gOfPFg',
    backersCount: 231,
    contractAddress: 'CC5A3F8B6G7E8C9D0E1F2A3B4C5D6E7F8A9B0C1D2E3F4A5B6C7D8E9F',
  },
  {
    id: 'camp_3',
    title: 'Monolith: The Exhibition',
    description: 'Ethereal monochromatic art gallery showing futuristic geometric structures. Dark slate textures.',
    creator: 'K. Sorenson',
    category: 'ART',
    targetAmount: 100000,
    currentAmount: 91000,
    daysLeft: 2,
    durationDays: 14,
    status: 'active',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNoZ027tBr7ctwLdGScjbmQPe2CvB0ft4JlZ8Jbf3IOX9QE5xPBwZNwqPFgXg1-p_R4Z4Im1aGyHF2uuRzzCDiDDzKFf-NAaeTqWISduY9MpwGoJ-BM59Q0O277aZvOilK58pKYRx9ycAh9QuF4aK4o9-_BYW_K0LQDMb47twb19UVI5mVNQrQQ51gITSJS7A7kwWhVfoSk4oWOUs_PdarHRr6f-ZW42O7YauRASgbXOBE4sUoWebavw',
    backersCount: 142,
    contractAddress: 'CC6A4F9B7G8E9C0D1E2F3A4B5C6D7E8F9A0B1C2D3E4F5A6B7C8D9E0F',
  },
  {
    id: 'camp_4',
    title: 'Machina-1 Keyboard',
    description: 'Aluminum modular custom mechanical keyboard. Modern and sleek precision design.',
    creator: 'Null-Set Design',
    category: 'TECH',
    targetAmount: 150000,
    currentAmount: 90000,
    daysLeft: 24,
    durationDays: 45,
    status: 'active',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1Za_dkIfRnL4VqwyxUcqioDJCQVd3GBlma9fuByyFH5IcnAZ11lWiBNli1FaNrfMx-hiGcqerSbeoiTYgrfgPlO4117uwkvFxGC-Uw9JHzV26VyrwGcWGGbkhrsi5uw_7aI0NveAtpscB_vsa0w7iC7ytbOe0cP4u8OH-xFYazxLnDc25GvtNeqUaDT0mJ2r9IlDhxNQCnBCibwRtxxzNQYuXBHPvhHjCbGJ3TdjBTGUXDXdiHHzMgQ',
    backersCount: 180,
    contractAddress: 'CC7A5F0B8G9E0C1D2E3F4A5B6C7D8E9F0A1B2C3D4E5F6A7B8C9D0E1F',
  },
  {
    id: 'camp_5',
    title: 'SolarGrid Saharan',
    description: 'Clean energy solar power grids receded into the vast desert horizon.',
    creator: 'Helios Energy',
    category: 'IMPACT',
    targetAmount: 1000000,
    currentAmount: 150000,
    daysLeft: 45,
    durationDays: 60,
    status: 'active',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBwRZY6xiaZhy8ogZcomzEeLhZpdH6FC7ZRe77DY-WlkBtuXJZzqmgawmBTepkATrGx0DKfqBeLVUhPXSIoCgtwauxWLGrdJvyzK-EKL3m6PJRygPKSzMN1MmjglW0m1Zwk6kdqQNwrJrjVGt8j3TwaWWCeBqoziEVVy2uyTS0F2YnG2MoFCJwlcTqkYQINq_8W8OmEZBMtKJWdYRLLNj1-zRhCAqG8hVPgtkDLDokmPzvsV0UifI2WLA',
    backersCount: 94,
    contractAddress: 'CC8A6F1B9G0E1C2D3E4F5A6B7C8D9E0F1A2B3C4D5E6F7A8B9C0D1E2F',
  },
  {
    id: 'camp_6',
    title: 'Plinth Hi-Fi Turntable',
    description: 'Acrylic luxury turntable and carbon fiber tonearm on a slate surface.',
    creator: 'Sonic Foundry',
    category: 'ART',
    targetAmount: 80000,
    currentAmount: 70400,
    daysLeft: 5,
    durationDays: 20,
    status: 'active',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxnSSuYw73Q7bjN4X-LZupiTwQWLJIwstzqlaXcWpuDacIdUeQyj792LJ46hrL50DsdVrgB-chHc842YgLyX54KRT2grebTG-xmWTQbjx1-pR4UnJbsUonR41G4yqvM5gv43QvW9tI5QqOb1O-XRSt3rtcQIEvRYca9xDiprhoUdFQ3LAz4lrw4D_zk2XZkoKuErBscqxfyR4IZeFnk9oRb4HdBb77t8asnZ7Mc8vdLVEm6ORstv41hg',
    backersCount: 153,
    contractAddress: 'CC9A7F2B0G1E2C3D4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B0C1D2E3F',
  },
  {
    id: 'camp_7',
    title: 'Cyber-Core Modular PC',
    description: 'Custom modular performance PC with open architecture design.',
    creator: 'Lumina Architects', // Same as verified dashboard user
    category: 'TECH',
    targetAmount: 500000,
    currentAmount: 342000,
    daysLeft: 12,
    durationDays: 30,
    status: 'active',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1Za_dkIfRnL4VqwyxUcqioDJCQVd3GBlma9fuByyFH5IcnAZ11lWiBNli1FaNrfMx-hiGcqerSbeoiTYgrfgPlO4117uwkvFxGC-Uw9JHzV26VyrwGcWGGbkhrsi5uw_7aI0NveAtpscB_vsa0w7iC7ytbOe0cP4u8OH-xFYazxLnDc25GvtNeqUaDT0mJ2r9IlDhxNQCnBCibwRtxxzNQYuXBHPvhHjCbGJ3TdjBTGUXDXdiHHzMgQ',
    backersCount: 402,
    contractAddress: 'CC0A8F3B1G2E3C4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A0B1C2D3E4F',
  },
  {
    id: 'camp_8',
    title: 'Green-Hydrogen Plant',
    description: 'Eco-friendly localized zero-carbon fuel production station.',
    creator: 'Lumina Architects',
    category: 'IMPACT',
    targetAmount: 2500000,
    currentAmount: 0,
    daysLeft: 60,
    durationDays: 60,
    status: 'draft',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBwRZY6xiaZhy8ogZcomzEeLhZpdH6FC7ZRe77DY-WlkBtuXJZzqmgawmBTepkATrGx0DKfqBeLVUhPXSIoCgtwauxWLGrdJvyzK-EKL3m6PJRygPKSzMN1MmjglW0m1Zwk6kdqQNwrJrjVGt8j3TwaWWCeBqoziEVVy2uyTS0F2YnG2MoFCJwlcTqkYQINq_8W8OmEZBMtKJWdYRLLNj1-zRhCAqG8hVPgtkDLDokmPzvsV0UifI2WLA',
    backersCount: 0,
    contractAddress: 'CC1A9F4B2G3E4C5D6E7F8A9B0C1D2E3F4A5B6C7D8E9F0A1B2C3D4E5F',
  },
  {
    id: 'camp_9',
    title: 'Neural-Net Artist AI',
    description: 'Automated generative fine-art physical plotting AI robot.',
    creator: 'Lumina Architects',
    category: 'ART',
    targetAmount: 100000,
    currentAmount: 125000,
    daysLeft: 0,
    durationDays: 14,
    status: 'completed',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNoZ027tBr7ctwLdGScjbmQPe2CvB0ft4JlZ8Jbf3IOX9QE5xPBwZNwqPFgXg1-p_R4Z4Im1aGyHF2uuRzzCDiDDzKFf-NAaeTqWISduY9MpwGoJ-BM59Q0O277aZvOilK58pKYRx9ycAh9QuF4aK4o9-_BYW_K0LQDMb47twb19UVI5mVNQrQQ51gITSJS7A7kwWhVfoSk4oWOUs_PdarHRr6f-ZW42O7YauRASgbXOBE4sUoWebavw',
    backersCount: 312,
    contractAddress: 'CC2A0F5B3G4E5C6D7E8F9A0B1C2D3E4F5A6B7C8D9E0F1A2B3C4D5E6F',
  }
];

export class CampaignService {
  private static getStoredCampaigns(): Campaign[] {
    const stored = localStorage.getItem('fundforge_campaigns');
    if (!stored) {
      localStorage.setItem('fundforge_campaigns', JSON.stringify(DEFAULT_CAMPAIGNS));
      return DEFAULT_CAMPAIGNS;
    }
    return JSON.parse(stored);
  }

  static getCampaigns(): Campaign[] {
    return this.getStoredCampaigns();
  }

  static getCampaignById(id: string): Campaign | undefined {
    const campaigns = this.getStoredCampaigns();
    return campaigns.find((c) => c.id === id);
  }

  static createCampaign(campaign: Omit<Campaign, 'id' | 'currentAmount' | 'backersCount' | 'status'>): Campaign {
    const campaigns = this.getStoredCampaigns();
    const newCampaign: Campaign = {
      ...campaign,
      id: `camp_${Date.now()}`,
      currentAmount: 0,
      backersCount: 0,
      status: 'active',
      contractAddress: 'CC' + Math.random().toString(36).substring(2, 10).toUpperCase() + '...' + Math.random().toString(36).substring(2, 6).toUpperCase(),
    };
    campaigns.push(newCampaign);
    localStorage.setItem('fundforge_campaigns', JSON.stringify(campaigns));
    return newCampaign;
  }

  static addDonation(campaignId: string, amount: number): Campaign | undefined {
    const campaigns = this.getStoredCampaigns();
    const campaign = campaigns.find((c) => c.id === campaignId);
    if (campaign) {
      campaign.currentAmount += amount;
      campaign.backersCount += 1;
      if (campaign.currentAmount >= campaign.targetAmount) {
        campaign.status = 'completed';
      }
      localStorage.setItem('fundforge_campaigns', JSON.stringify(campaigns));
      return campaign;
    }
    return undefined;
  }
}

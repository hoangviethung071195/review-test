export interface CampaignModel {
  information: GeneralInfoModel;
  subCampaigns: SubCampaignModel[];

  // Extra info
  currentSubCampaign?: SubCampaignModel;
}

export interface GeneralInfoModel {
  name: string;
  describe: string;
}

export interface SubCampaignModel {
  name: string;
  status: boolean;
  ads: AdModel[];

  // Extra info
  subCampaignId?: string;
  totalQuantity?: number;
  isError?: boolean;
}

export interface AdModel {
  name: string;
  quantity: number;

  // Extra info
  adId?: string;
  checked?: boolean;
  isError?: boolean;
}
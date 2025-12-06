export interface UploadedFile {
    name: string;
    type: string;
    size: number;
    preview: string;
    file?: File | null;
    progress?: number;
    url?: string;
}

export interface EducationRecord {
    id: string;
    degree: string;
    institution: string;
    endYear: string;
    document: UploadedFile | null;
}

export interface PersonalDetails {
    employeeId: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    preferredName?: string;
    dob: string;
    gender: 'Male' | 'Female' | 'Other' | '';
    maritalStatus: 'Single' | 'Married' | 'Divorced' | 'Widowed' | '';
    bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | '';
    mobile: string;
    alternateMobile?: string | null;
    email: string;
    idProofType?: 'Aadhaar' | 'PAN' | '';
    idProofNumber?: string;
    photo?: UploadedFile | null;
    idProof?: UploadedFile | null;
    emergencyContactName: string;
    emergencyContactNumber: string;
    relationship: 'Spouse' | 'Child' | 'Father' | 'Mother' | 'Sibling' | 'Other' | '';
    salary: number | null;
    verifiedStatus?: object;
    hasPreviousPf?: boolean;
    uanNumber?: string;
    pfNumber?: string;
}

export interface FamilyMember {
    id: string;
    relation: 'Spouse' | 'Child' | 'Father' | 'Mother' | 'Sibling' | 'Other';
    name: string;
    dob: string;
    dependent: boolean;
}
export interface GmcDetails {
    isOptedIn: boolean | null;
    optOutReason?: string;
    policyAmount?: '1L' | '2L' | '';
    nomineeName?: string;
    nomineeRelation?: 'Spouse' | 'Child' | 'Father' | 'Mother' | '';
    wantsToAddDependents?: boolean;
    selectedSpouseId?: string;
    selectedChildIds?: string[];
    gmcPolicyCopy?: UploadedFile | null;
    declarationAccepted?: boolean;
    alternateInsuranceProvider?: string;
    alternateInsuranceStartDate?: string;
    alternateInsuranceEndDate?: string;
    alternateInsuranceCoverage?: string;
}
export interface Address {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
    verifiedStatus?: {
        line1?: boolean;
        line2?: boolean;
        city?: boolean;
        state?: boolean;
        country?: boolean;
        pincode?: boolean;
    };
}

export interface AddressDetails {
    present: Address;
    permanent: Address;
    sameAsPresent: boolean;
}
export interface BankDetails {
    accountHolderName: string;
    accountNumber: string;
    confirmAccountNumber: string;
    ifscCode: string;
    bankName: string;
    branchName: string;
    bankProof?: UploadedFile | null;
}

export interface EsiDetails {
    hasEsi: boolean;
    esiNumber?: string;
}

export interface AvatarUploadProps {
  file: UploadedFile | undefined | null;
  onFileChange: (file: UploadedFile | null) => void;
}

export type OnboardingStep =
  | 'personal'
  | 'address'
  | 'organization'
  | 'family'
  | 'education'
  | 'bank'
  | 'uan'
  | 'esi'
  | 'gmc'
  | 'uniform'
  | 'documents'
  | 'biometrics'
  | 'review';

export interface Organization {
    id: string;
    shortName: string;
}

export type AssetType = 'Phone' | 'Computer' | 'Vehicle' | 'Sim' | 'IdCard' | 'Petrocard' | 'Tools' | 'Other';

export interface AssetBase {
    id: string;
    type: AssetType;
    siteId?: string;
}

export interface PhoneAsset extends AssetBase {
    type: 'Phone';
    brand: string;
    imei: string;
    color: string;
    condition: string;
    chargerStatus: string;
    displayStatus: string;
    bodyStatus: string;
    picture?: UploadedFile | null;
}

export interface SimAsset extends AssetBase {
    type: 'Sim';
    number: string;
}

export interface ComputerAsset extends AssetBase {
    type: 'Computer';
    computerType: string;
    brand: string;
    serialNumber: string;
    windowsKey: string;
    condition: string;
    chargerStatus: string;
    bagStatus: string;
    mouseStatus: string;
    displayStatus: string;
    bodyStatus: string;
    officeStatus: string;
    antivirusStatus: string;
    picture?: UploadedFile | null;
}

export interface IdCardAsset extends AssetBase {
    type: 'IdCard';
    issueDate: string;
}

export interface PetrocardAsset extends AssetBase {
    type: 'Petrocard';
    number: string;
}

export interface VehicleAsset extends AssetBase {
    type: 'Vehicle';
    vehicleType: string;
    brand: string;
    vehicleNumber: string;
    chassisNumber: string;
    dlNumber: string;
    kmsAtIssue: number | null;
    condition: string;
    finesStatus: string;
    insuranceValidity: string;
    pollutionCertValidity: string;
    dlFrontPic?: UploadedFile | null;
    dlBackPic?: UploadedFile | null;
    picture?: UploadedFile | null;
}

export interface ToolAssetItem {
    id: string;
    name: string;
    description: string;
    quantity: number;
}

export interface ToolsAsset extends AssetBase {
    type: 'Tools';
    toolList: ToolAssetItem[];
    picture?: UploadedFile | null;
}

export interface OtherAsset extends AssetBase {
    type: 'Other';
    name: string;
    brand: string;
    model: string;
    serialNumber: string;
    condition: string;
    issueCondition: string;
    accessories: string;
    picture?: UploadedFile | null;
}

export type Asset =
    | PhoneAsset
    | SimAsset
    | ComputerAsset
    | IdCardAsset
    | PetrocardAsset
    | VehicleAsset
    | ToolsAsset
    | OtherAsset;
export interface GmcPolicySettings {
  applicability: 'Mandatory' | 'Optional - Opt-in Default' | 'Optional - Opt-out Default';
  optInDisclaimer: string;
  coverageDetails: string;
  optOutDisclaimer: string;
  requireAlternateInsurance: boolean;
  collectProvider: boolean;
  collectStartDate: boolean;
  collectEndDate: boolean;
  collectExtentOfCover: boolean;
}
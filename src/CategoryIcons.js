import WorkIcon from "@mui/icons-material/Work"; 
import WorkOutlineIcon from "@mui/icons-material/WorkOutline"; 
import TrendingUpIcon from "@mui/icons-material/TrendingUp"; 
import BusinessIcon from "@mui/icons-material/Business"; 
import HomeIcon from "@mui/icons-material/Home"; 
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn"; 
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import SchoolIcon from "@mui/icons-material/School"; 
import ElderlyIcon from "@mui/icons-material/Elderly"; 
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PublicIcon from "@mui/icons-material/Public"; 
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar"; 
import FlightIcon from "@mui/icons-material/Flight";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore"; 
import HouseIcon from "@mui/icons-material/House"; 
import FlashOnIcon from "@mui/icons-material/FlashOn"; 
import CommuteIcon from "@mui/icons-material/Commute"; 
import ExploreIcon from "@mui/icons-material/Explore";
import SecurityIcon from "@mui/icons-material/Security"; 
import BookIcon from "@mui/icons-material/Book"; 
import RestaurantIcon from "@mui/icons-material/Restaurant";
import StoreIcon from "@mui/icons-material/Store";
import PhoneIcon from "@mui/icons-material/Phone";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import PaymentIcon from "@mui/icons-material/Payment";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital"; 
import LocalShippingIcon from "@mui/icons-material/LocalShipping"; 
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import PieChartIcon from "@mui/icons-material/PieChart";
import ApartmentIcon from "@mui/icons-material/Apartment"; 
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"; 
import CurrencyBitcoinIcon from "@mui/icons-material/CurrencyBitcoin";
import DiamondIcon from "@mui/icons-material/Diamond";
import GroupIcon from "@mui/icons-material/Group";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import BarChartIcon from "@mui/icons-material/BarChart";
import WarningIcon from "@mui/icons-material/Warning"; // Emergency Fund
import AirlineSeatIndividualSuiteIcon from "@mui/icons-material/AirlineSeatIndividualSuite";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import BeachAccessIcon from "@mui/icons-material/BeachAccess"; 
import MoneyOffIcon from "@mui/icons-material/MoneyOff"; 
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom"; 
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";

export const categoryOptions = {
  income: [
    { name: "Salary", icon: <WorkIcon /> },
    { name: "Freelance", icon: <WorkOutlineIcon /> },
    { name: "Investment", icon: <TrendingUpIcon /> },
    { name: "Business", icon: <BusinessIcon /> },
    { name: "Rental Home", icon: <HomeIcon /> },
    { name: "Gift", icon: <CardGiftcardIcon /> },
    { name: "Dividend", icon: <MonetizationOnIcon /> },
    { name: "Interest", icon: <MonetizationOnIcon /> },
    { name: "Royalties", icon: <MusicNoteIcon /> },
    { name: "Scholarship", icon: <SchoolIcon /> },
    { name: "Pension", icon: <ElderlyIcon /> },
    { name: "Sales", icon: <ShoppingCartIcon /> },
    { name: "Global Income", icon: <PublicIcon /> },
    { name: "Car Allowance", icon: <DirectionsCarIcon /> },
    { name: "Travel Reimbursement", icon: <FlightIcon /> },
  ],
  expense: [
    { name: "Groceries", icon: <LocalGroceryStoreIcon /> },
    { name: "Rent/Mortgage", icon: <HouseIcon /> },
    { name: "Utilities", icon: <FlashOnIcon /> },
    { name: "Transportation", icon: <CommuteIcon /> },
    { name: "Travel", icon: <ExploreIcon /> },
    { name: "Insurance", icon: <SecurityIcon /> },
    { name: "Education", icon: <BookIcon /> },
    { name: "Dining Out", icon: <RestaurantIcon /> },
    { name: "Shopping", icon: <StoreIcon /> },
    { name: "Phone Bill", icon: <PhoneIcon /> },
    { name: "Subscription", icon: <SubscriptionsIcon /> },
    { name: "Loan Payment", icon: <PaymentIcon /> },
    { name: "Medical Expense", icon: <LocalHospitalIcon /> },
    { name: "Delivery/Shipping", icon: <LocalShippingIcon /> },
    { name: "Taxes", icon: <AccountBalanceIcon /> },
  ],
  investment: [
    { name: "Stock", icon: <ShowChartIcon /> },
    { name: "Mutual Fund", icon: <PieChartIcon /> },
    { name: "Real Estate", icon: <ApartmentIcon /> },
    { name: "Bond", icon: <AttachMoneyIcon /> },
    { name: "Crypto", icon: <CurrencyBitcoinIcon /> },
    { name: "Precious Metal", icon: <DiamondIcon /> },
    { name: "Private Equity", icon: <GroupIcon /> },
    { name: "Venture Capital", icon: <RocketLaunchIcon /> },
    { name: "REITs", icon: <BusinessCenterIcon /> },
    { name: "Index Funds", icon: <BarChartIcon /> },
  ],
  saving: [
    { name: "Emergency Fund", icon: <WarningIcon /> },
    { name: "Retirement Saving", icon: <AirlineSeatIndividualSuiteIcon /> },
    { name: "College Fund", icon: <LocalLibraryIcon /> },
    { name: "Vacation Fund", icon: <BeachAccessIcon /> },
    { name: "Debt Repayment", icon: <MoneyOffIcon /> },
    { name: "Short Term Saving", icon: <HourglassTopIcon /> },
    { name: "Long Term Saving", icon: <HourglassBottomIcon /> },
    { name: "Health Saving", icon: <HealthAndSafetyIcon /> },
  ],
};
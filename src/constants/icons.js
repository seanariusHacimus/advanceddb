import React from 'react';
import { ReactComponent as IconDashboard } from '../assets/header/indicatorIcons/dashboard.svg';
import { ReactComponent as IconStartABusiness } from '../assets/header/indicatorIcons/start-a-business.svg';
import { ReactComponent as IconConstruction } from '../assets/header/indicatorIcons/constructions.svg';
import { ReactComponent as IconElectricty } from '../assets/header/indicatorIcons/flash.svg';
import { ReactComponent as IconInvestors } from '../assets/header/indicatorIcons/graph.svg';
import { ReactComponent as IconProperty } from '../assets/header/indicatorIcons/book.svg';
import { ReactComponent as IconCredit } from '../assets/header/indicatorIcons/credit.svg';
import { ReactComponent as IconTax } from '../assets/header/indicatorIcons/tax.svg';
import { ReactComponent as IconTrade } from '../assets/header/indicatorIcons/trading.svg';
import { ReactComponent as IconEnforce } from '../assets/header/indicatorIcons/enforce.svg';
import { ReactComponent as IconContract } from '../assets/header/indicatorIcons/contracting.svg';
import { ReactComponent as IconInsolvency } from '../assets/header/indicatorIcons/resolving.svg';

export default {
  '/dashboard': <IconDashboard className="menu-icon" />,
  'starting-a-business': <IconStartABusiness className="menu-icon" />,
  'dealing-with-construction-permits': <IconConstruction className="menu-icon" />,
  'getting-electricity': <IconElectricty className="menu-icon stroke" />,
  'registering-property': <IconProperty className="menu-icon" />,
  'getting-credit': <IconCredit className="menu-icon" />,
  'protecting-minority-investors': <IconInvestors className="menu-icon stroke" />,
  'paying-taxes': <IconTax className="menu-icon" />,
  'trading-across-borders': <IconTrade className="menu-icon" />,
  'enforcing-contracts': <IconEnforce className="menu-icon" />,
  'resolving-insolvency': <IconInsolvency className="menu-icon" />,
  'contracting-with-the-government': <IconContract className="menu-icon" />,
};

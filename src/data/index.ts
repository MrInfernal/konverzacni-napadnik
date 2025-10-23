import { relationships } from './relationships';
import { career } from './career';
import { dreams } from './dreams';
import { childhood } from './childhood';
import { fears } from './fears';
import { values } from './values';
import { identity } from './identity';
import { creativity } from './creativity';
import { happiness } from './happiness';
import { philosophy } from './philosophy';
import { future } from './future';

export interface Category {
  id: string;
  name: string;
  description: string;
  questions: string[];
  color: string;
}

export const categories: Category[] = [
  {
    id: 'relationships',
    name: 'Vztahy',
    description: 'Otázky o přátelství, lásce a mezilidských vazbách',
    questions: relationships,
    color: 'bg-pink-500'
  },
  {
    id: 'career',
    name: 'Kariéra',
    description: 'Otázky o práci, ambicích a profesním růstu',
    questions: career,
    color: 'bg-blue-500'
  },
  {
    id: 'dreams',
    name: 'Sny',
    description: 'Otázky o touhách, přáních a budoucích plánech',
    questions: dreams,
    color: 'bg-purple-500'
  },
  {
    id: 'childhood',
    name: 'Dětství',
    description: 'Otázky o vzpomínkách, rodině a minulosti',
    questions: childhood,
    color: 'bg-yellow-500'
  },
  {
    id: 'fears',
    name: 'Strachy',
    description: 'Otázky o obavách, úzkostech a vulnerabilitě',
    questions: fears,
    color: 'bg-red-500'
  },
  {
    id: 'values',
    name: 'Hodnoty',
    description: 'Otázky o morálce, principech a životních hodnotách',
    questions: values,
    color: 'bg-green-500'
  },
  {
    id: 'identity',
    name: 'Identita',
    description: 'Otázky o sobě samém, osobnosti a sebepoznání',
    questions: identity,
    color: 'bg-indigo-500'
  },
  {
    id: 'creativity',
    name: 'Kreativita',
    description: 'Otázky o umění, tvorbě a sebevyjádření',
    questions: creativity,
    color: 'bg-orange-500'
  },
  {
    id: 'happiness',
    name: 'Štěstí',
    description: 'Otázky o radosti, naplnění a pozitivních emocích',
    questions: happiness,
    color: 'bg-amber-500'
  },
  {
    id: 'philosophy',
    name: 'Filozofie',
    description: 'Otázky o smyslu života, existenci a hlubokých myšlenkách',
    questions: philosophy,
    color: 'bg-slate-500'
  },
  {
    id: 'future',
    name: 'Budoucnost',
    description: 'Otázky o plánech, vizích a očekáváních',
    questions: future,
    color: 'bg-teal-500'
  }
];

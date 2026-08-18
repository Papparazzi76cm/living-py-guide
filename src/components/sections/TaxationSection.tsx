import { useState } from 'react';
import { AnimatedDiv } from '../AnimatedDiv';
import { Icon } from '../Icon';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CURRENCIES } from '../../constants';
import { Currency } from '../../types';

interface Deduction {
  id: string;
  concept: string;
  amount: string;
}

export const TaxationSection = () => {
  const { t } = useLanguage();
  // --- Lógica de la Calculadora ---
  const [currencyCode, setCurrencyCode] = useState<Currency['code']>('USD');
  const [income, setIncome] = useState('');
  const [deductions, setDeductions] = useState<Deduction[]>([
    { id: '1', concept: '', amount: '' }
  ]);
  const [totalTaxPYG, setTotalTaxPYG] = useState<number | null>(null);
  const [netIncomePYG, setNetIncomePYG] = useState<number | null>(null);

  // Tramos de IRP-RSP según el PDF 
  const BRACKET_1_LIMIT = 50000000;
  const BRACKET_2_LIMIT = 150000000;
  const BRACKET_1_RATE = 0.08;
  const BRACKET_2_RATE = 0.09;
  const BRACKET_3_RATE = 0.10;

  // Impuestos pre-calculados por tramo
  const BRACKET_1_TAX = BRACKET_1_LIMIT * BRACKET_1_RATE; // 4,000,000
  const BRACKET_2_TAX =
    (BRACKET_2_LIMIT - BRACKET_1_LIMIT) * BRACKET_2_RATE; // 100,000,000 * 0.09 = 9,000,000

  const addDeduction = () => {
    setDeductions([...deductions, { id: Date.now().toString(), concept: '', amount: '' }]);
  };

  const removeDeduction = (id: string) => {
    if (deductions.length > 1) {
      setDeductions(deductions.filter(d => d.id !== id));
    }
  };

  const updateDeduction = (id: string, field: 'concept' | 'amount', value: string) => {
    setDeductions(deductions.map(d => 
      d.id === id ? { ...d, [field]: value } : d
    ));
  };

  const handleCalculate = () => {
    // Limpiar comas o puntos para asegurar que sea un número flotante
    const numericIncome = parseFloat(income.replace(/[.,]/g, '')) || 0;
    if (numericIncome <= 0) {
      setTotalTaxPYG(0);
      setNetIncomePYG(0);
      return;
    }

    const selectedCurrency = CURRENCIES.find((c) => c.code === currencyCode);
    if (!selectedCurrency) return;

    // Convertir el ingreso a Guaraníes para el cálculo
    const incomeInPYG = numericIncome * selectedCurrency.rate;

    // Calcular total de deducciones en PYG
    const totalDeductionsPYG = deductions.reduce((sum, deduction) => {
      const amount = parseFloat(deduction.amount.replace(/[.,]/g, '')) || 0;
      return sum + (amount * selectedCurrency.rate);
    }, 0);

    // Calcular renta neta (ingreso - deducciones)
    const netIncome = Math.max(0, incomeInPYG - totalDeductionsPYG);
    setNetIncomePYG(netIncome);

    let taxInPYG = 0;

    // Lógica de tramos progresivos sobre la renta neta
    if (netIncome <= BRACKET_1_LIMIT) {
      taxInPYG = netIncome * BRACKET_1_RATE;
    } else if (netIncome <= BRACKET_2_LIMIT) {
      taxInPYG =
        BRACKET_1_TAX + (netIncome - BRACKET_1_LIMIT) * BRACKET_2_RATE;
    } else {
      taxInPYG =
        BRACKET_1_TAX +
        BRACKET_2_TAX +
        (netIncome - BRACKET_2_LIMIT) * BRACKET_3_RATE;
    }

    setTotalTaxPYG(taxInPYG);
  };

  /**
   * Formatea un monto numérico a la moneda seleccionada.
   */
  const formatCurrency = (amount: number, currency: Currency['code']) => {
    const selected = CURRENCIES.find((c) => c.code === currency);
    if (!selected) return 'N/A';

    // No convertir si es PYG, dividir si es moneda extranjera
    const value = currency === 'PYG' ? amount : amount / selected.rate;

    return `${selected.symbol} ${value.toLocaleString('es-PY', {
      maximumFractionDigits: currency === 'PYG' ? 0 : 2,
      minimumFractionDigits: currency === 'PYG' ? 0 : 2,
    })}`;
  };
  // --- Fin de la Lógica de la Calculadora ---

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6">
        <AnimatedDiv className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
            {t.taxation.title}
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
            {t.taxation.subtitle}
          </p>
        </AnimatedDiv>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Columna de Información (Existente) */}
          <div className="lg:col-span-2">
            <AnimatedDiv delay={100}>
              <Card className="mb-8 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Icon name="shield" size={24} className="text-primary" />
                    {t.taxation.principleTitle}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg text-foreground">
                    {t.taxation.principleText}
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-start space-x-3">
                      <Icon
                        name="check"
                        className="text-green-600 mt-1 flex-shrink-0"
                      />
                      <p>
                        <strong>{t.taxation.principle0Tax}</strong>{' '}
                        {t.taxation.principle0TaxText}
                      </p>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </AnimatedDiv>

            <AnimatedDiv delay={200}>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem
                  value="item-1"
                  className="bg-white rounded-xl shadow-lg px-6"
                >
                  <AccordionTrigger className="text-xl font-bold hover:no-underline">
                    {t.taxation.irpTitle}
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                    <p>
                      {t.taxation.irpText}
                     </p>
                    <div>
                      <h4 className="font-semibold text-base text-primary">
                        {t.taxation.irpRSPTitle}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {t.taxation.irpRSPText}
                      </p>
                      <ul className="list-disc pl-5 text-sm space-y-1">
                        <li>
                          <strong>{t.taxation.irpRSPRate}</strong>
                        </li>
                        <li>
                          <strong>{t.taxation.irpRSPDeductions}</strong>
                        </li>
                        <li>
                          <strong>{t.taxation.irpRSPDeductionsExpat}</strong>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-base text-primary">
                        {t.taxation.irpRGCTitle}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {t.taxation.irpRGCText}
                      </p>
                      <ul className="list-disc pl-5 text-sm space-y-1">
                        <li>
                          <strong>{t.taxation.irpRGCRate}</strong>
                        </li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="item-2"
                  className="bg-white rounded-xl shadow-lg px-6 mt-4"
                >
                  <AccordionTrigger className="text-xl font-bold hover:no-underline">
                    {t.taxation.ivaTitle}
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                    <p>{t.taxation.ivaText}</p>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      <li><strong>{t.taxation.ivaGeneral}</strong></li>
                      <li>
                        <strong>{t.taxation.ivaReduced}</strong>
                      </li>
                      <li>
                        <strong>{t.taxation.ivaDigitalNomads}</strong>
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="item-3"
                  className="bg-white rounded-xl shadow-lg px-6 mt-4"
                >
                  <AccordionTrigger className="text-xl font-bold hover:no-underline">
                    {t.taxation.iduTitle}
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                    <p>
                      {t.taxation.iduText}
                    </p>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      <li><strong>{t.taxation.iduResident}</strong></li>
                      <li><strong>{t.taxation.iduNonResident}</strong></li>
                      <li>
                        <strong>{t.taxation.iduImportant}</strong>
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </AnimatedDiv>
          </div>

          {/* Columna de Calculadora (Nueva) */}
          <div className="lg:col-span-1">
            <AnimatedDiv delay={300}>
              <Card className="shadow-lg hover-lift sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Icon name="calculator" size={24} className="text-primary" />
                    {t.taxation.calculatorTitle}
                  </CardTitle>
                  <CardDescription>
                    {t.taxation.calculatorSubtitle}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currency">{t.taxation.currency}</Label>
                    <Select
                      value={currencyCode}
                      onValueChange={(val) =>
                        setCurrencyCode(val as Currency['code'])
                      }
                    >
                      <SelectTrigger id="currency">
                        <SelectValue placeholder={t.taxation.currency} />
                      </SelectTrigger>
                      <SelectContent>
                        {CURRENCIES.map((curr) => (
                          <SelectItem key={curr.code} value={curr.code}>
                            {curr.code} ({curr.symbol})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="income">{t.taxation.annualIncome}</Label>
                    <Input
                      id="income"
                      type="text"
                      placeholder="Ej: 50000"
                      value={income}
                      onChange={(e) => setIncome(e.target.value)}
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>{t.taxation.deductions}</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addDeduction}
                      >
                        <Icon name="plus" size={14} className="mr-1" />
                        {t.taxation.addDeduction}
                      </Button>
                    </div>
                    
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {deductions.map((deduction, index) => (
                        <div key={deduction.id} className="flex gap-2">
                          <Input
                            placeholder={t.taxation.deductionConcept}
                            value={deduction.concept}
                            onChange={(e) => updateDeduction(deduction.id, 'concept', e.target.value)}
                            className="flex-1"
                          />
                          <Input
                            placeholder={t.taxation.deductionAmount}
                            type="text"
                            value={deduction.amount}
                            onChange={(e) => updateDeduction(deduction.id, 'amount', e.target.value)}
                            className="w-28"
                          />
                          {deductions.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeDeduction(deduction.id)}
                              className="px-2"
                            >
                              <Icon name="trash" size={16} className="text-destructive" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button onClick={handleCalculate} className="w-full">
                    <Icon name="calculator" size={16} className="mr-2" />
                    {t.taxation.calculate}
                  </Button>
                </CardContent>

                {totalTaxPYG !== null && netIncomePYG !== null && (
                  <CardFooter className="flex flex-col items-start space-y-3 bg-muted/50 pt-6">
                    <h4 className="font-semibold text-lg">
                      {t.taxation.resultsTitle}
                    </h4>
                    
                    <div className="w-full flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">
                        {t.taxation.netIncome}
                      </span>
                      <span className="font-semibold">
                        {formatCurrency(netIncomePYG, currencyCode)}
                      </span>
                    </div>

                    <div className="w-full h-px bg-border my-2" />

                    <div className="w-full flex justify-between items-center">
                      <span className="text-muted-foreground">
                        {t.taxation.taxInPYG}
                      </span>
                      <span className="font-bold text-lg">
                        {formatCurrency(totalTaxPYG, 'PYG')}
                      </span>
                    </div>
                    {currencyCode !== 'PYG' && (
                      <div className="w-full flex justify-between items-center">
                        <span className="text-muted-foreground">
                          {t.taxation.taxIn} {currencyCode}:
                        </span>
                        <span className="font-bold text-lg">
                          {formatCurrency(totalTaxPYG, currencyCode)}
                        </span>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground pt-2">
                      {t.taxation.calculatorDisclaimer}
                    </p>
                  </CardFooter>
                )}
              </Card>
            </AnimatedDiv>
          </div>
        </div>
      </div>
    </section>
  );
};
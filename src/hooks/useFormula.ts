import { useState, useCallback, useRef } from 'react';
import { formulaService } from '@/services/formulaService';
import { FormulaType, FormulaVariant, FormulaInput, FormulaResult, FormulaError } from '@/types/formulas';

interface CalculationHistoryItem {
  id: string;
  timestamp: Date;
  formulaType: FormulaType;
  variant: FormulaVariant;
  inputs: FormulaInput;
  result: FormulaResult | FormulaError;
}

interface UseFormulaState {
  result: FormulaResult | null;
  error: FormulaError | null;
  isCalculating: boolean;
  history: CalculationHistoryItem[];
}

interface UseFormulaReturn extends UseFormulaState {
  calculate: (formulaType: FormulaType, variant: FormulaVariant, inputs: FormulaInput) => Promise<void>;
  clearResult: () => void;
  clearHistory: () => void;
  getLatestResult: () => FormulaResult | FormulaError | null;
  getAvailableFormulas: () => Record<string, string[]>;
  getFormulasByType: (type: FormulaType) => any[];
  getFormulaConfig: (variant: FormulaVariant) => any;
}

/**
 * Custom hook for formula calculations
 * Provides state management for formula calculations including history tracking
 */
export const useFormula = (): UseFormulaReturn => {
  const [state, setState] = useState<UseFormulaState>({
    result: null,
    error: null,
    isCalculating: false,
    history: [],
  });

  const historyIdCounter = useRef(0);

  const calculate = useCallback(async (
    formulaType: FormulaType,
    variant: FormulaVariant,
    inputs: FormulaInput
  ) => {
    setState(prev => ({
      ...prev,
      isCalculating: true,
      error: null,
    }));

    try {
      const result = await formulaService.calculate(formulaType, variant, inputs);
      
      // Create history item
      const historyItem: CalculationHistoryItem = {
        id: `calc_${++historyIdCounter.current}`,
        timestamp: new Date(),
        formulaType,
        variant,
        inputs: { ...inputs },
        result,
      };

      setState(prev => ({
        ...prev,
        result: 'value' in result ? result : null,
        error: 'error' in result ? result : null,
        isCalculating: false,
        history: [historyItem, ...prev.history.slice(0, 49)], // Keep last 50 calculations
      }));
    } catch (error) {
      const errorResult: FormulaError = {
        code: 'CALCULATION_EXCEPTION',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      };

      setState(prev => ({
        ...prev,
        result: null,
        error: errorResult,
        isCalculating: false,
      }));
    }
  }, []);

  const clearResult = useCallback(() => {
    setState(prev => ({
      ...prev,
      result: null,
      error: null,
    }));
  }, []);

  const clearHistory = useCallback(() => {
    setState(prev => ({
      ...prev,
      history: [],
    }));
  }, []);

  const getLatestResult = useCallback(() => {
    return state.result || state.error;
  }, [state.result, state.error]);

  const getAvailableFormulas = useCallback(() => {
    return formulaService.getAvailableFormulas();
  }, []);

  const getFormulasByType = useCallback((type: FormulaType) => {
    return formulaService.getFormulasByType(type);
  }, []);

  const getFormulaConfig = useCallback((variant: FormulaVariant) => {
    return formulaService.getFormulaConfig(variant);
  }, []);

  return {
    ...state,
    calculate,
    clearResult,
    clearHistory,
    getLatestResult,
    getAvailableFormulas,
    getFormulasByType,
    getFormulaConfig,
  };
};

export default useFormula;
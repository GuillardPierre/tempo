import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Category } from '../types/worktime';
import { httpGet } from '../components/utils/querySetup';
import ENDPOINTS from '../components/utils/ENDPOINT';

type CategoryContextType = {
	categories: Category[];
	setCategories: (categories: Category[] | ((prev: Category[]) => Category[])) => void;
	refreshCategories: () => Promise<void>;
};

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const useCategoryContext = () => {
	const context = useContext(CategoryContext);
	if (!context) {
		throw new Error('useCategoryContext must be used within a CategoryProvider');
	}
	return context;
};

type CategoryProviderProps = {
	children: ReactNode;
};

export const CategoryProvider: React.FC<CategoryProviderProps> = ({ children }) => {
	const [categories, setCategories] = useState<Category[]>([]);

	const refreshCategories = async () => {
		try {
			const rep = await httpGet(`${ENDPOINTS.category.root}all`);
			if (rep.ok) {
				const data = await rep.json();
				setCategories(data);
			}
		} catch (error) {
			console.error('Erreur refreshCategories:', error);
		}
	};

	useEffect(() => {
		refreshCategories();
	}, []);

	return (
		<CategoryContext.Provider value={{ categories, setCategories, refreshCategories }}>
			{children}
		</CategoryContext.Provider>
	);
};

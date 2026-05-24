"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRepository = void 0;
const Category_1 = require("../entities/Category");
const AppError_1 = require("../../../../../shared/errors/AppError");
const categoryContants_1 = require("../../../contants/categoryContants");
class CategoryRepository {
    create(_a) {
        return __awaiter(this, arguments, void 0, function* ({ name }) {
            const createCategory = yield Category_1.Category.create({ name });
            const category = {
                id: createCategory.id,
                name: createCategory.name,
            };
            return Promise.resolve(category);
        });
    }
    findByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const categoryFound = yield Category_1.Category.findOne({ name });
            if (!categoryFound) {
                return null;
            }
            return {
                id: categoryFound._id,
                name: categoryFound.name,
            };
        });
    }
    getCategory() {
        return __awaiter(this, void 0, void 0, function* () {
            const categoriesFound = yield Category_1.Category.find();
            if (categoriesFound.length < 0) {
                throw new AppError_1.AppError(categoryContants_1.categoryConstants.NOT_FOUND, 404);
            }
            let categories = [];
            for (let i = 0; i < categoriesFound.length; i++) {
                const category = {
                    id: categoriesFound[i].id,
                    name: categoriesFound[i].name,
                };
                categories.push(category);
            }
            return Promise.resolve(categories);
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const categoryFound = yield Category_1.Category.findOne({ _id: id });
            if (!categoryFound) {
                return null;
            }
            return {
                id: categoryFound._id,
                name: categoryFound.name,
            };
        });
    }
}
exports.CategoryRepository = CategoryRepository;

import {Document, FilterQuery,Model, UpdateQuery} from 'mongoose'
import {BaseError} from '../c1-errors/BaseError'

// типы конкретной базы данных
export type BaseDocType = Document
export type BaseModelType<T extends BaseDocType> = Model<T>
// export type BaseCreateQueryType<T> = CreateQuery<T>
export type BaseCreateQueryType<T> = any // todo: refactor
export type BaseUpdateQueryType<T> = UpdateQuery<T>
export type BaseFilterQueryType<T> = FilterQuery<T>
// export type BaseDocDefType<T> = DocumentDefinition<T>

// sort from mongoose ¯\_(ツ)_/¯
/**
 * Sets the sort order
 * If an object is passed, values allowed are asc, desc, ascending, descending, 1, and -1.
 * If a string is passed, it must be a space delimited list of path names. The
 * sort order of each path is ascending unless the path name is prefixed with -
 * which will be treated as descending.
 */
export type BaseSortQueryType<T> = string | any

export class DB<T extends BaseDocType> {
    constructor(
        public _Model: BaseModelType<T>,
        public modelName: string,
        public _checkFindQuery: (find: { [key: string]: any }) => BaseFilterQueryType<T>,
        // uniqueProperties?: Extract<keyof BaseCreateQueryType<T>, keyof BaseFilterQueryType<T>>[]
        public uniqueProperties?: (keyof BaseCreateQueryType<T>)[]
    ) {
    }

    createItem(checkedItem: BaseCreateQueryType<T>) {
        return this.DBPromise<T>(
            async () => {
                // await this.checkUnique(checkedItem, '.createItem') // excess check

                return await this._Model.create(checkedItem)
            },
            '.createItem',
            {checkedItem},
        )
    }

    readArray(
        find: { [key: string]: any },
        sort: BaseSortQueryType<T>,
        itemForPageCount = 1000,
        pageNumber = 1
    ) {
        // return this.DALPromise<T[] extends Array<any> ? BaseDocDefType<T>[] : (BaseDocDefType<T> | null)>(
        // return this.DALPromise<Promise<Array<EnforceDocument<T, {}>>extends unknown[] ? LeanDocument<Array<EnforceDocument<T, {}>>[number]>[] : (Array<EnforceDocument<T, {}>> extends Document ? LeanDocument<Array<EnforceDocument<T, {}>>> : Array<EnforceDocument<T, {}>>)>>(
        return this.DBPromise<T[]>(
            async () => {
                const finalSort = Object.keys(sort).length ? sort : {updated: -1}
                const finalFind = this._checkFindQuery(find)

                const items: any = await this._Model.find(finalFind)
                    .sort(finalSort)
                    .skip(itemForPageCount * (pageNumber - 1))
                    .limit(itemForPageCount)
                    .lean()
                    .exec()
                return items as T[]
            },
            '.readArray',
            {find, sort, itemForPageCount, pageNumber},
        )
    }

    getItemById(id: string) {
        return this.DBPromise<T | null>(
            () => {
                return this._Model.findById(id)
                    .exec()
            },
            '.getItemById',
            {id},
        )
    }

    countItems(find: { [key: string]: any }) {
        return this.DBPromise<number>(
            () => {
                const finalFind = this._checkFindQuery(find)

                return this._Model.countDocuments(finalFind)
                    .exec()
            },
            '.countItems',
            {find},
        )
    }

    removeItemById(id: string) {
        return this.DBPromise<T | null>(
            () => {
                return this._Model.findByIdAndDelete(id)
                    .exec()
            },
            '.removeItemById',
            {id},
        )
    }

    updateItemById(id: string, item: BaseUpdateQueryType<T>) {
        return this.DBPromise<T | null>(
            () => {
                return this._Model.findByIdAndUpdate(id, item, {new: true})
                    .exec()
            },
            '.updateItemById',
            {id, item},
        )
    }

    // not need
    checkUnique(checkedItem: BaseCreateQueryType<T>, methodName: string) { // excess check
        return this.DBPromise<void>(
            async () => {
                // if (this.uniqueProperties) {
                //     let find: BaseFilterQueryType<T> = {}
                //
                //     for (const p of this.uniqueProperties) {
                //         if (checkedItem[p]) {
                //             find[p] = checkedItem[p]
                //
                //             const count = await this.countItems(find)
                //
                //             if (count) {
                //                 const findKey = Object.keys(find)[0]
                //
                //                 throw new BaseError({
                //                     type: 400,
                //                     inTry: `DAL:${this.modelName}${methodName}.checkUnique`,
                //                     e: `Duplicate ${this.modelName} item property {${findKey}: ${find[findKey]}} ^._.^`,
                //                     more: {checkedItem, uniqueProperties: this.uniqueProperties, find, count},
                //                 })
                //             } else {
                //                 find = {}
                //             }
                //         }
                //     }
                // }
            },
            methodName + '.checkUnique',
            {checkedItem},
        )
    }

    // more

    DBPromise<A>(
        getAnswer: () => Promise<A>,
        methodName: string,
        more?: any
    ) {
        return BaseError
            .withTry(getAnswer, methodName + 'DB:' + this.modelName, more) // отлов и стандартизация ошибок
    }
}

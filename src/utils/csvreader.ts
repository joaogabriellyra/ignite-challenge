import * as fs from 'fs'
import * as path from 'path'
import { parse } from 'csv-parse'
import { ITaskCSV } from '../interfaces/itask'

const csvFilePath = path.resolve(__dirname, '../csv/file.csv')
const headers = ['title', 'description']
const fileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' })

export const csvReader = async (): Promise<ITaskCSV[]> => {
  return new Promise((resolve, reject) => {
    parse(
      fileContent,
      {
        delimiter: ',',
        columns: headers,
        from_line: 2,
      },
      (error, result: ITaskCSV[]) => {
        if (error) {
          return reject(new Error('ERROR PROCESSING THE CSV FILE'))
        }
        resolve(result)
      },
    )
  })
}

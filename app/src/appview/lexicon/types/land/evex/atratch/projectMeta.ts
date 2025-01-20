/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { ValidationResult, BlobRef } from '@atproto/lexicon'
import { lexicons } from '../../../../lexicons'
import { isObj, hasProp } from '../../../../util'
import { CID } from 'multiformats/cid'
import * as LandEvexAtratchDefs from './defs'

export interface Record {
  meta: LandEvexAtratchDefs.ProjectMeta
  [k: string]: unknown
}

export function isRecord(v: unknown): v is Record {
  return (
    isObj(v) &&
    hasProp(v, '$type') &&
    (v.$type === 'land.evex.atratch.projectMeta#main' ||
      v.$type === 'land.evex.atratch.projectMeta')
  )
}

export function validateRecord(v: unknown): ValidationResult {
  return lexicons.validate('land.evex.atratch.projectMeta#main', v)
}

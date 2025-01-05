/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { ValidationResult, BlobRef } from '@atproto/lexicon'
import { lexicons } from '../../../../lexicons'
import { isObj, hasProp } from '../../../../util'
import { CID } from 'multiformats/cid'

export interface ProjectMeta {
  title: string
  description: string
  credit: string
  [k: string]: unknown
}

export function isProjectMeta(v: unknown): v is ProjectMeta {
  return (
    isObj(v) &&
    hasProp(v, '$type') &&
    v.$type === 'land.evex.atratch.defs#projectMeta'
  )
}

export function validateProjectMeta(v: unknown): ValidationResult {
  return lexicons.validate('land.evex.atratch.defs#projectMeta', v)
}

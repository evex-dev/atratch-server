/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { ValidationResult, BlobRef } from '@atproto/lexicon'
import { lexicons } from '../../../../lexicons'
import { isObj, hasProp } from '../../../../util'
import { CID } from 'multiformats/cid'

export interface Record {
  map: AssetPair[]
  [k: string]: unknown
}

export function isRecord(v: unknown): v is Record {
  return (
    isObj(v) &&
    hasProp(v, '$type') &&
    (v.$type === 'land.evex.atratch.assetMap#main' ||
      v.$type === 'land.evex.atratch.assetMap')
  )
}

export function validateRecord(v: unknown): ValidationResult {
  return lexicons.validate('land.evex.atratch.assetMap#main', v)
}

export interface AssetPair {
  /** scratch's md5 hash */
  hash: string
  blob: BlobRef
  [k: string]: unknown
}

export function isAssetPair(v: unknown): v is AssetPair {
  return (
    isObj(v) &&
    hasProp(v, '$type') &&
    v.$type === 'land.evex.atratch.assetMap#assetPair'
  )
}

export function validateAssetPair(v: unknown): ValidationResult {
  return lexicons.validate('land.evex.atratch.assetMap#assetPair', v)
}

/* eslint-disable @typescript-eslint/no-loss-of-precision */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/jsx-no-leaked-render */
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from '@store/index'
import { useNavigate } from 'react-router-dom'
import InfiniteScroll from 'react-infinite-scroll-component'
import {
  HeaderWrap,
  QuickPopover,
  TabsWrap,
  TabsWrapItem,
  ActiveTab,
  Border,
  Footer,
  ContentWrap,
  TaskItem,
  CanClick,
  StatusBox,
  SpinWrap,
  TimeName,
  ItemWrap,
  LoadingMore,
} from '../style'
import {
  getMineFinishList,
  getMineNoFinishList,
  getVerifyUserList,
} from '@/services/mine'
import EditExamine from '@/components/EditExamine'
import NewLoadingTransition from '@/components/NewLoadingTransition'
import NoData from '@/components/NoData'
import { Skeleton } from 'antd'

const data: any = {
  今天: {
    list: [
      {
        id: 1006209,
        project_id: 375,
        parent_id: 1006190,
        iterate_id: 0,
        user_id: 3,
        class_id: 0,
        category_id: 612,
        name: 'feiji',
        priority: {
          id: 11269,
          name: '\u9ad8',
          content: '\u9ad8',
          color: '#FA9746',
          icon: 'high',
          identity: 'priority',
          content_txt: '\u9ad8',
          group_content_txt: '',
        },
        status: {
          id: 1901,
          category_id: 612,
          status_id: 11273,
          is_start: 1,
          is_end: 2,
          can_changes_category_status: ['1901', '1902', '1904'],
          status: {
            id: 11273,
            content: '\u89c4\u5212\u4e2d',
            color: '#FA9746',
            content_txt: '',
            group_content_txt: '',
          },
        },
        expected_start_at: null,
        expected_end_at: null,
        finish_at: null,
        story_count: 0,
        business_value: '',
        category_status_id: 1901,
        schedule: 0,
        custom_field: null,
        verify_lock: 2,
        is_handover: null,
        prefix_key: 2,
        level_tree: '0,1006190',
        level: 2,
        project_type: 1,
        is_bug: 2,
        severity: 0,
        discovery_version: 0,
        solution: '',
        sort: 0,
        created_at: '2023-10-25 14:29:12',
        updated_at: '2023-10-25 15:15:37',
        deleted_at: null,
        iterate_name: null,
        discovery_version_name: null,
        user_name: '\u98de\u98de',
        user_avatar:
          'https://oa-1308485183.cos.ap-chengdu.myqcloud.com/oa-dev-img/1504303190303051778/1551758466375991298/2023-04-27/studios_3.webp',
        class: null,
        story_prefix_key: '0000000000-2',
        child_story_count: 0,
        project: {
          id: 375,
          name: '0000000000000000',
          is_public: 1,
          member_id: 2945,
          user_group_id: 1174,
          user_ismember: true,
        },
        is_new: '1',
        category: '\u9700\u6c42',
        category_attachment:
          'https://agile-api.dev.staryuntech.com/attachment/category_icon/folder.png',
        category_remark: '',
        work_type: 1,
        usersInfo: [
          {
            id: 3,
            name: '\u98de\u98de',
            gender: 2,
            nickname: '',
            email: 'yangyi123@ifunmail.com',
            avatar:
              'https://oa-1308485183.cos.ap-chengdu.myqcloud.com/oa-dev-img/1504303190303051778/1551758466375991298/2023-04-27/studios_3.webp',
          },
          {
            id: 39,
            name: ' \u6c6a\u5fd7\u541b',
            gender: 2,
            nickname: 'W_wang',
            email: 'youyi@ifun.com',
            avatar:
              'https://oa-1308485183.cos.ap-chengdu.myqcloud.com/oa-dev-img/1504303190303051778/1504303190676344834/2023-01-30/1622381402%281%29.jpg',
          },
          {
            id: 6,
            name: '\u9a6c\u6210\u9f99',
            gender: 1,
            nickname: '',
            email: 'machenglong1@ifunmail.com',
            avatar:
              'https://oa-1308485183.cos.ap-chengdu.myqcloud.com/oa-dev-img/1504303190303051778/1504303190676344834/2023-04-24/68e19872-c04e-44d4-b4c7-9b86bcd0cfd8.png',
          },
          {
            id: 143,
            name: 'zhangsan',
            gender: 2,
            nickname: '\u5f20\u4e09\u4e09',
            email: 'zhangsan@ifun.com',
            avatar: '',
          },
        ],
        copy_send_users: [
          {
            id: 2,
            name: '0812',
            gender: 2,
            nickname: '',
            email: 'zub@ifunmail.com',
            avatar: '',
          },
        ],
        users_name_ids: [3, 39, 6, 143],
        users_name: '',
        users_copysend_name_ids: [2],
        users_copysend_name: '',
        status_id: 11273,
        content_txt: '\u89c4\u5212\u4e2d',
        category_config_list: {
          class_id: 2,
          created_at: 2,
          expected_end_at: 2,
          expected_start_at: 2,
          finish_at: 2,
          iterate_id: 2,
          parent_id: 2,
          priority: 2,
          schedule: 2,
          user_name: 2,
          copysend: 2,
          users: 2,
        },
        parent: {
          id: 1006190,
          name: '111111',
        },
        is_member: true,
      },
      {
        id: 1006158,
        project_id: 490,
        parent_id: 0,
        iterate_id: 0,
        user_id: 39,
        class_id: 0,
        category_id: 677,
        name: '11111',
        priority: {
          id: 0,
          name: '\u65e0\u4f18\u5148\u7ea7',
          content_txt: '',
          group_content_txt: '',
        },
        status: {
          id: 2121,
          category_id: 677,
          status_id: 14154,
          is_start: 1,
          is_end: 2,
          can_changes_category_status: ['2121', '2122', '2124'],
          status: {
            id: 14154,
            content: '\u89c4\u5212\u4e2d',
            color: '#FA9746',
            content_txt: '',
            group_content_txt: '',
          },
        },
        expected_start_at: null,
        expected_end_at: null,
        finish_at: null,
        story_count: 0,
        business_value: '',
        category_status_id: 2121,
        schedule: 7,
        custom_field: null,
        verify_lock: 2,
        is_handover: null,
        prefix_key: 11,
        level_tree: '0',
        level: 1,
        project_type: 1,
        is_bug: 2,
        severity: 0,
        discovery_version: 0,
        solution: '',
        sort: 0,
        created_at: '2023-09-28 11:07:36',
        updated_at: '2023-10-25 10:23:30',
        deleted_at: null,
        iterate_name: null,
        discovery_version_name: null,
        user_name: ' \u6c6a\u5fd7\u541b',
        user_avatar:
          'https://oa-1308485183.cos.ap-chengdu.myqcloud.com/oa-dev-img/1504303190303051778/1504303190676344834/2023-01-30/1622381402%281%29.jpg',
        class: null,
        story_prefix_key: 'DWWCSDD-11',
        child_story_count: 0,
        project: {
          id: 490,
          name: '\u5927\u6587\u6587\u6d4b\u8bd5\u8fed\u4ee3',
          is_public: 2,
          member_id: 1521,
          user_group_id: 1509,
          user_ismember: true,
        },
        is_new: 2,
        category: '\u9700\u6c42',
        category_attachment:
          'https://agile-api.dev.staryuntech.com/attachment/category_icon/folder.png',
        category_remark: '',
        work_type: 1,
        usersInfo: [
          {
            id: 39,
            name: ' \u6c6a\u5fd7\u541b',
            gender: 2,
            nickname: 'W_wang',
            email: 'youyi@ifun.com',
            avatar:
              'https://oa-1308485183.cos.ap-chengdu.myqcloud.com/oa-dev-img/1504303190303051778/1504303190676344834/2023-01-30/1622381402%281%29.jpg',
          },
        ],
        copy_send_users: [],
        users_name_ids: [39],
        users_name: '',
        users_copysend_name_ids: [],
        users_copysend_name: '',
        status_id: 14154,
        content_txt: '\u89c4\u5212\u4e2d',
        category_config_list: {
          parent_id: 2,
          priority: 2,
          iterate_id: 2,
          class_id: 2,
          schedule: 2,
          user_name: 2,
          users: 2,
          copysend: 2,
          created_at: 2,
          expected_start_at: 2,
          expected_end_at: 2,
          finish_at: 2,
        },
        parent: null,
        is_member: true,
      },
    ],
    pager: {
      total: 23,
    },
  },
  昨天: {
    list: [
      {
        id: 1003169,
        project_id: 490,
        parent_id: 1006036,
        iterate_id: 244,
        user_id: 39,
        class_id: 0,
        category_id: 678,
        name: '\u7b2c\u4e00\u4e2a\u7f3a\u96771',
        priority: {
          id: 14149,
          name: '\u6781\u9ad8',
          content: '\u6781\u9ad8',
          color: '#FF5C5E',
          icon: 'extremely-high',
          identity: 'priority',
          content_txt: '\u6781\u9ad8',
          group_content_txt: '',
        },
        status: {
          id: 2125,
          category_id: 678,
          status_id: 14154,
          is_start: 1,
          is_end: 2,
          can_changes_category_status: ['2125', '2126', '2128'],
          status: {
            id: 14154,
            content: '\u89c4\u5212\u4e2d',
            color: '#FA9746',
            content_txt: '',
            group_content_txt: '',
          },
        },
        expected_start_at: '2023-09-19',
        expected_end_at: '2023-09-28',
        finish_at: null,
        story_count: 0,
        business_value: '',
        category_status_id: 2125,
        schedule: 0,
        custom_field: null,
        verify_lock: 2,
        is_handover: null,
        prefix_key: 2,
        level_tree: '0,1003168,1003170,1006036',
        level: 4,
        project_type: 1,
        is_bug: 1,
        severity: {
          id: 14183,
          name: '\u81f4\u547d',
          content: '\u81f4\u547d',
          color: '#fbeff1',
          icon: 'deadly',
          identity: 'severity',
          content_txt: '',
          group_content_txt: '',
        },
        discovery_version: 244,
        solution: '',
        sort: 0,
        created_at: '2023-07-21 19:07:58',
        updated_at: '2023-10-18 17:37:19',
        deleted_at: null,
        iterate_name: '1',
        discovery_version_name: '1',
        user_name: ' \u6c6a\u5fd7\u541b',
        user_avatar:
          'https://oa-1308485183.cos.ap-chengdu.myqcloud.com/oa-dev-img/1504303190303051778/1504303190676344834/2023-01-30/1622381402%281%29.jpg',
        class: null,
        story_prefix_key: 'DWWCSDD-2',
        child_story_count: 0,
        project: {
          id: 490,
          name: '\u5927\u6587\u6587\u6d4b\u8bd5\u8fed\u4ee3',
          is_public: 2,
          member_id: 1521,
          user_group_id: 1509,
          user_ismember: true,
        },
        is_new: 2,
        category: 'BUG\u7f3a\u9677',
        category_attachment:
          'https://agile-api.dev.staryuntech.com/attachment/category_icon/other.png',
        category_remark: '',
        work_type: 2,
        usersInfo: [
          {
            id: 79,
            name: '\u9ec4\u6ce2',
            gender: 2,
            nickname: '',
            email: 'huangbo@dingstartech.com',
            avatar: '',
          },
          {
            id: 39,
            name: ' \u6c6a\u5fd7\u541b',
            gender: 2,
            nickname: 'W_wang',
            email: 'youyi@ifun.com',
            avatar:
              'https://oa-1308485183.cos.ap-chengdu.myqcloud.com/oa-dev-img/1504303190303051778/1504303190676344834/2023-01-30/1622381402%281%29.jpg',
          },
        ],
        copy_send_users: [
          {
            id: 3,
            name: '\u98de\u98de',
            gender: 2,
            nickname: '',
            email: 'yangyi123@ifunmail.com',
            avatar:
              'https://oa-1308485183.cos.ap-chengdu.myqcloud.com/oa-dev-img/1504303190303051778/1551758466375991298/2023-04-27/studios_3.webp',
          },
          {
            id: 39,
            name: ' \u6c6a\u5fd7\u541b',
            gender: 2,
            nickname: 'W_wang',
            email: 'youyi@ifun.com',
            avatar:
              'https://oa-1308485183.cos.ap-chengdu.myqcloud.com/oa-dev-img/1504303190303051778/1504303190676344834/2023-01-30/1622381402%281%29.jpg',
          },
        ],
        users_name_ids: [79, 39],
        users_name: '',
        users_copysend_name_ids: [3, 39],
        users_copysend_name: '',
        status_id: 14154,
        content_txt: '\u89c4\u5212\u4e2d',
        category_config_list: {
          parent_id: 2,
          priority: 2,
          severity: 2,
          discovery_version: 2,
          solution: 2,
          iterate_id: 2,
          class_id: 2,
          schedule: 2,
          user_name: 2,
          users: 2,
          copysend: 2,
          created_at: 2,
          expected_start_at: 2,
          expected_end_at: 2,
          finish_at: 2,
        },
        parent: {
          id: 1006036,
          name: '1111111056',
        },
        is_member: true,
      },
      {
        id: 1006195,
        company_id: 1504303190303051778,
        project_id: 489,
        parent_id: 0,
        iterate_id: 267,
        user_id: 39,
        class_id: 0,
        category_id: 675,
        name: '121212',
        priority: {
          id: 0,
          name: '\u65e0\u4f18\u5148\u7ea7',
          content_txt: '',
          group_content_txt: '',
        },
        status: {
          id: 2115,
          category_id: 675,
          status_id: 14117,
          is_start: 1,
          is_end: 2,
          can_changes_category_status: ['2115', '2116'],
          status: {
            id: 14117,
            company_id: 1504303190303051778,
            content: '\u89c4\u5212\u4e2d',
            color: '#FA9746',
            content_txt: '',
            group_content_txt: '',
          },
        },
        expected_start_at: null,
        expected_end_at: null,
        finish_at: null,
        story_count: 0,
        business_value: '',
        category_status_id: 2115,
        schedule: 0,
        custom_field: null,
        verify_lock: 2,
        is_handover: null,
        prefix_key: 5,
        level_tree: '0',
        level: 1,
        project_type: 2,
        is_bug: 2,
        severity: 0,
        discovery_version: 0,
        solution: '',
        sort: 0,
        created_at: '2023-10-16 14:22:31',
        updated_at: '2023-10-16 14:22:31',
        deleted_at: null,
        iterate_name:
          '\u6d4b\u8bd5\u540d\u79f0\u5f88\u957f\u7684\u540d\u79f0\u554a\u54c8\u54c8\u54c8\u54c8\u7802\u6d46\u5676\u51e0\u5206\u516c\u53f8\u811a\u540e\u8ddf\u526f\u4e66\u8bb0\u611f\u89c9\u662f\u5e72\u7c89111111111111\u7802\u6d46\u501f\u53e4\u8bbd\u4eca',
        discovery_version_name: null,
        user_name: ' \u6c6a\u5fd7\u541b',
        user_avatar:
          'https://oa-1308485183.cos.ap-chengdu.myqcloud.com/oa-dev-img/1504303190303051778/1504303190676344834/2023-01-30/1622381402%281%29.jpg',
        class: null,
        story_prefix_key: 'DWWCC-5',
        child_story_count: 0,
        project: {
          id: 489,
          name: '\u5927\u6587\u6587\u51b2\u523a',
          is_public: 2,
          member_id: 1518,
          user_group_id: 1506,
          user_ismember: true,
        },
        is_new: 2,
        category: '\u9700\u6c42',
        category_attachment:
          'https://agile-api.dev.staryuntech.com/attachment/category_icon/security.png',
        category_remark: '',
        work_type: 4,
        usersInfo: [
          {
            id: 39,
            name: ' \u6c6a\u5fd7\u541b',
            gender: 2,
            nickname: 'W_wang',
            email: 'youyi@ifun.com',
            avatar:
              'https://oa-1308485183.cos.ap-chengdu.myqcloud.com/oa-dev-img/1504303190303051778/1504303190676344834/2023-01-30/1622381402%281%29.jpg',
          },
        ],
        copy_send_users: [],
        users_name_ids: [39],
        users_name: '',
        users_copysend_name_ids: [],
        users_copysend_name: '',
        status_id: 14117,
        content_txt: '\u89c4\u5212\u4e2d',
        category_config_list: {
          parent_id: 2,
          priority: 2,
          iterate_id: 2,
          class_id: 2,
          user_name: 2,
          users: 2,
          copysend: 2,
          created_at: 2,
          expected_start_at: 2,
          expected_end_at: 2,
          finish_at: 2,
          schedule: 2,
        },
        parent: null,
        is_member: true,
      },
    ],
    pager: {
      total: 32,
    },
  },
  '2023-10-25': {
    list: [
      {
        id: 1003166,
        company_id: 1504303190303051778,
        project_id: 489,
        parent_id: 1003165,
        iterate_id: 214,
        user_id: 39,
        class_id: 0,
        category_id: 675,
        name: '\u9700\u6c42',
        priority: {
          id: 14114,
          name: '\u4e2d',
          content: '\u4e2d',
          color: '#2877FF',
          icon: 'middle',
          identity: 'priority',
          content_txt: '\u4e2d',
          group_content_txt: '',
        },
        status: {
          id: 2115,
          category_id: 675,
          status_id: 14117,
          is_start: 1,
          is_end: 2,
          can_changes_category_status: ['2115', '2116'],
          status: {
            id: 14117,
            company_id: 1504303190303051778,
            content: '\u89c4\u5212\u4e2d',
            color: '#FA9746',
            content_txt: '',
            group_content_txt: '',
          },
        },
        expected_start_at: null,
        expected_end_at: null,
        finish_at: null,
        story_count: 0,
        business_value: '',
        category_status_id: 2115,
        schedule: 0,
        custom_field: null,
        verify_lock: 2,
        is_handover: null,
        prefix_key: 2,
        level_tree: '0,1003165',
        level: 2,
        project_type: 2,
        is_bug: 2,
        severity: 0,
        discovery_version: 0,
        solution: '',
        sort: 0,
        created_at: '2023-07-21 18:43:26',
        updated_at: '2023-10-10 10:42:26',
        deleted_at: null,
        iterate_name: '\u65b0\u5efa\u7684\u51b2\u523a1',
        discovery_version_name: null,
        user_name: ' \u6c6a\u5fd7\u541b',
        user_avatar:
          'https://oa-1308485183.cos.ap-chengdu.myqcloud.com/oa-dev-img/1504303190303051778/1504303190676344834/2023-01-30/1622381402%281%29.jpg',
        class: null,
        story_prefix_key: 'DWWCC-2',
        child_story_count: 0,
        project: {
          id: 489,
          name: '\u5927\u6587\u6587\u51b2\u523a',
          is_public: 2,
          member_id: 1518,
          user_group_id: 1506,
          user_ismember: true,
        },
        is_new: 2,
        category: '\u9700\u6c42',
        category_attachment:
          'https://agile-api.dev.staryuntech.com/attachment/category_icon/security.png',
        category_remark: '',
        work_type: 4,
        usersInfo: [
          {
            id: 3,
            name: '\u98de\u98de',
            gender: 2,
            nickname: '',
            email: 'yangyi123@ifunmail.com',
            avatar:
              'https://oa-1308485183.cos.ap-chengdu.myqcloud.com/oa-dev-img/1504303190303051778/1551758466375991298/2023-04-27/studios_3.webp',
          },
          {
            id: 39,
            name: ' \u6c6a\u5fd7\u541b',
            gender: 2,
            nickname: 'W_wang',
            email: 'youyi@ifun.com',
            avatar:
              'https://oa-1308485183.cos.ap-chengdu.myqcloud.com/oa-dev-img/1504303190303051778/1504303190676344834/2023-01-30/1622381402%281%29.jpg',
          },
        ],
        copy_send_users: [
          {
            id: 39,
            name: ' \u6c6a\u5fd7\u541b',
            gender: 2,
            nickname: 'W_wang',
            email: 'youyi@ifun.com',
            avatar:
              'https://oa-1308485183.cos.ap-chengdu.myqcloud.com/oa-dev-img/1504303190303051778/1504303190676344834/2023-01-30/1622381402%281%29.jpg',
          },
        ],
        users_name_ids: [3, 39],
        users_name: '',
        users_copysend_name_ids: [39],
        users_copysend_name: '',
        status_id: 14117,
        content_txt: '\u89c4\u5212\u4e2d',
        category_config_list: {
          parent_id: 2,
          priority: 2,
          iterate_id: 2,
          class_id: 2,
          user_name: 2,
          users: 2,
          copysend: 2,
          created_at: 2,
          expected_start_at: 2,
          expected_end_at: 2,
          finish_at: 2,
          schedule: 2,
        },
        parent: {
          id: 1003165,
          name: '\u957f\u6545\u4e8b',
        },
        is_member: true,
      },
      {
        id: 1003237,
        company_id: 1504303190303051778,
        project_id: 489,
        parent_id: 1003165,
        iterate_id: 214,
        user_id: 39,
        class_id: 0,
        category_id: 675,
        name: '1111155355',
        priority: {
          id: 0,
          name: '\u65e0\u4f18\u5148\u7ea7',
          content_txt: '',
          group_content_txt: '',
        },
        status: {
          id: 2115,
          category_id: 675,
          status_id: 14117,
          is_start: 1,
          is_end: 2,
          can_changes_category_status: ['2115', '2116'],
          status: {
            id: 14117,
            company_id: 1504303190303051778,
            content: '\u89c4\u5212\u4e2d',
            color: '#FA9746',
            content_txt: '',
            group_content_txt: '',
          },
        },
        expected_start_at: '2023-10-10',
        expected_end_at: '2023-10-11',
        finish_at: null,
        story_count: 0,
        business_value: '',
        category_status_id: 2115,
        schedule: 0,
        custom_field: null,
        verify_lock: 2,
        is_handover: null,
        prefix_key: 4,
        level_tree: '0,1003165',
        level: 2,
        project_type: 2,
        is_bug: 2,
        severity: 0,
        discovery_version: 0,
        solution: '',
        sort: 0,
        created_at: '2023-08-08 22:55:24',
        updated_at: '2023-10-10 10:41:13',
        deleted_at: null,
        iterate_name: '\u65b0\u5efa\u7684\u51b2\u523a1',
        discovery_version_name: null,
        user_name: ' \u6c6a\u5fd7\u541b',
        user_avatar:
          'https://oa-1308485183.cos.ap-chengdu.myqcloud.com/oa-dev-img/1504303190303051778/1504303190676344834/2023-01-30/1622381402%281%29.jpg',
        class: null,
        story_prefix_key: 'DWWCC-4',
        child_story_count: 0,
        project: {
          id: 489,
          name: '\u5927\u6587\u6587\u51b2\u523a',
          is_public: 2,
          member_id: 1518,
          user_group_id: 1506,
          user_ismember: true,
        },
        is_new: 2,
        category: '\u9700\u6c42',
        category_attachment:
          'https://agile-api.dev.staryuntech.com/attachment/category_icon/security.png',
        category_remark: '',
        work_type: 4,
        usersInfo: [
          {
            id: 39,
            name: ' \u6c6a\u5fd7\u541b',
            gender: 2,
            nickname: 'W_wang',
            email: 'youyi@ifun.com',
            avatar:
              'https://oa-1308485183.cos.ap-chengdu.myqcloud.com/oa-dev-img/1504303190303051778/1504303190676344834/2023-01-30/1622381402%281%29.jpg',
          },
          {
            id: 6,
            name: '\u9a6c\u6210\u9f99',
            gender: 1,
            nickname: '',
            email: 'machenglong1@ifunmail.com',
            avatar:
              'https://oa-1308485183.cos.ap-chengdu.myqcloud.com/oa-dev-img/1504303190303051778/1504303190676344834/2023-04-24/68e19872-c04e-44d4-b4c7-9b86bcd0cfd8.png',
          },
          {
            id: 693,
            name: '\u9a6c\u4e8c',
            gender: 1,
            nickname: '\u9a6c\u4e8c',
            email: 'dx187028@dingstartech.com',
            avatar: '',
          },
        ],
        copy_send_users: [],
        users_name_ids: [39, 6, 693],
        users_name: '',
        users_copysend_name_ids: [],
        users_copysend_name: '',
        status_id: 14117,
        content_txt: '\u89c4\u5212\u4e2d',
        category_config_list: {
          parent_id: 2,
          priority: 2,
          iterate_id: 2,
          class_id: 2,
          user_name: 2,
          users: 2,
          copysend: 2,
          created_at: 2,
          expected_start_at: 2,
          expected_end_at: 2,
          finish_at: 2,
          schedule: 2,
        },
        parent: {
          id: 1003165,
          name: '\u957f\u6545\u4e8b',
        },
        is_member: true,
      },
    ],
    pager: {
      total: 12,
    },
  },
}

interface GroupItemsProps {
  row: any
  onOpenExamine(item: any): void
  onClickItem(item: any): void
  tabActive: number
  onChangeData(list: any, key: string): void
}

const GroupItems = (props: GroupItemsProps) => {
  const { row, onOpenExamine, onClickItem, tabActive } = props
  const [t] = useTranslation()
  const [page, setPage] = useState(1)
  // 加载更多的loading
  const [moreLoading, setMoreLoading] = useState(false)

  // 点击加载更多
  const onLoadingMore = async () => {
    setMoreLoading(true)
    // 调用更多接口
    setPage(page + 1)
    setMoreLoading(false)
  }

  useEffect(() => {
    setPage(1)
  }, [tabActive])

  return (
    <>
      {row?.map((i: any) => (
        <TaskItem key={i.id}>
          <div className="left" onClick={() => onClickItem(i)}>
            <img className="icon" src={i.project_category?.attachment?.path} />
            <div className="info">
              <span className="name">{i.name}</span>
              <span className="sub">{i.project.name}</span>
            </div>
          </div>
          {tabActive === 1 ? (
            <CanClick onClick={() => onOpenExamine(i)}>
              {t('newlyAdd.waitExamine')}
            </CanClick>
          ) : (
            <StatusBox
              style={{
                background:
                  i.status?.is_start === 1 && i.status?.is_end === 2
                    ? 'var(--primary-d2)'
                    : i.status?.is_end === 1 && i.status?.is_start === 2
                    ? 'var(--neutral-n7)'
                    : i.status?.is_start === 2 && i.status?.is_end === 2
                    ? 'var(--function-success)'
                    : '',
                color:
                  i.status?.is_start === 1 && i.status?.is_end === 2
                    ? 'var(--neutral-n7)'
                    : i.status?.is_end === 1 && i.status?.is_start === 2
                    ? 'var(--neutral-n1-d1)'
                    : i.status?.is_start === 2 && i.status?.is_end === 2
                    ? 'var(--neutral-n7)'
                    : '',
              }}
            >
              {i.status?.status?.content}
            </StatusBox>
          )}
        </TaskItem>
      ))}
      {page * 30 < row?.pager?.total && (
        <LoadingMore onClick={onLoadingMore}>
          {moreLoading && (
            <img
              width={16}
              style={{ marginRight: 4 }}
              src="https://mj-system-1308485183.cos.accelerate.myqcloud.com/public/shareLoading.gif"
            />
          )}
          {t('loadMore')}
        </LoadingMore>
      )}
    </>
  )
}

interface QuickMineProps {
  isVisible: boolean
  onClose(): void
}

const QuickMine = (props: QuickMineProps) => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const tabBox = useRef<HTMLDivElement>(null)
  const tabActive2 = useRef<HTMLDivElement>(null)
  const { isRefresh, userInfo } = useSelector(store => store.user)
  const { language } = useSelector(store => store.global)

  // 审核详情打开
  const [isExamineVisible, setIsExamineVisible] = useState(false)
  //   加载状态
  const [isSpinning, setIsSpinning] = useState(false)
  //   当前选中的是那个tab
  const [tabActive, setTabActive] = useState(0)
  // 审核列表
  const [dataList, setDataList] = useState<any>([])
  // 审核数据
  const [verifyInfo, setVerifyInfo] = useState({})
  // 待办的分页参数
  const [upcomingPage, setUpcomingPage] = useState(1)
  // 待审核的分页参数
  const [pendingReviewPage, setPendingReviewPage] = useState(1)
  // 已办的分页参数
  const [processedPage, setProcessedPage] = useState(1)
  // 每页加载的个数
  const [pageSize, setPageSize] = useState(20)
  //   tab列表
  const tabs = [
    {
      label: t('mine.needDeal'),
    },
    {
      label: t('pendingReview'),
    },
    {
      label: t('have_done'),
    },
  ]

  // 已办
  const onGetMineFinishList = async () => {
    setIsSpinning(true)
    const res = await getMineFinishList({
      page: processedPage,
      pagesize: pageSize,
    })
    setDataList(res.list)
    setIsSpinning(false)
  }

  // 待办
  const onGetMineNoFinishList = async () => {
    setIsSpinning(true)
    const res = await getMineNoFinishList({
      page: upcomingPage,
      pagesize: pageSize,
    })
    // debugger
    setDataList(res.list)
    setIsSpinning(false)
  }

  // 获取待审核的列表
  const getVerifyList = async () => {
    setIsSpinning(true)
    const params = {
      page: pendingReviewPage,
      pagesize: pageSize,
    }
    const result = await getVerifyUserList(params)
    console.log('result---', result)
    setIsSpinning(false)
    setDataList(result?.list || {})
  }

  //   获取数据 tabActive 0 待办 1 待审核 2 已办理
  const getData = () => {
    setDataList({})
    switch (tabActive) {
      case 2:
        onGetMineFinishList()
        break
      case 1:
        // 待审核
        getVerifyList()
        break

      default:
        onGetMineNoFinishList()
        break
    }
  }
  //  tabActive 0 待办 1 待审核 2 已办理
  const fetchMoreData = () => {
    switch (tabActive) {
      case 2:
        onGetMineFinishList()
        break
      case 1:
        getVerifyList()
        break
      case 0:
        onGetMineNoFinishList()
        break
    }
  }
  //   跳转到我的
  const onToMine = () => {
    props.onClose()
    //
  }

  // 待审核-点击跳转详情
  const onClickItem = async (item: any) => {
    //
  }

  // 点击打开审核弹窗
  const onOpenExamine = (item: any) => {
    props.onClose()
    setVerifyInfo(item)
    setIsExamineVisible(true)
  }

  // 更多数据合并
  const onChangeData = (list: any, key: string) => {
    //
  }

  useEffect(() => {
    props.isVisible && getData()
  }, [props.isVisible, tabActive])

  useEffect(() => {
    if (!props.isVisible) {
      return
    }
    for (let i = 0; i < 3; i++) {
      tabBox.current?.children[i].addEventListener('click', e => {
        if (tabActive2.current) {
          tabActive2.current.style.left = `${
            (tabBox.current?.children[i] as HTMLDivElement).offsetLeft
          }px`
          tabActive2.current.style.width = `${tabBox.current?.children[i].clientWidth}px`
        }
      })
    }
  }, [])

  useEffect(() => {
    if (!tabBox.current) {
      return
    }
    const index = tabs.findIndex((i: any, index2) => index2 === tabActive)

    tabActive2.current!.style.left = `${
      (tabBox.current?.children[index] as HTMLDivElement).offsetLeft === 0
        ? 2
        : (tabBox.current?.children[index] as HTMLDivElement).offsetLeft
    }px`
    tabActive2.current!.style.width = `${
      tabBox.current?.children[index].clientWidth === 0
        ? 60
        : tabBox.current?.children[index].clientWidth
    }px`
  }, [tabActive, isRefresh])

  useEffect(() => {
    if (props.isVisible) {
      setTabActive(0)
    }
    setTimeout(() => {
      if (tabActive2.current && props.isVisible) {
        tabActive2.current.style.left = `${
          (tabBox.current?.children[0] as HTMLDivElement).offsetLeft
        }px`
        tabActive2.current.style.width = `${tabBox.current?.children[0].clientWidth}px`
      }
    }, 500)
  }, [props.isVisible, isRefresh])

  const hasMore = useMemo(() => {
    if (!dataList.list) {
      return false
    }
    const allTask = Object.values(dataList.list).flat(2)
    if (allTask.length < dataList.pager.total) {
      return true
    }
    return false
  }, [dataList])
  return (
    <>
      {isExamineVisible && (
        <EditExamine
          isVisible={isExamineVisible}
          onClose={() => {
            setIsExamineVisible(false)
            setVerifyInfo({})
          }}
          item={verifyInfo}
          isEdit
          onUpdate={getVerifyList}
        />
      )}
      <QuickPopover local={language}>
        <HeaderWrap>
          <TabsWrap ref={tabBox}>
            {tabs.map((i: any, index) => (
              <TabsWrapItem
                onClick={() => setTabActive(index)}
                active={tabActive === index}
                key={i.label}
              >
                {i.label}
              </TabsWrapItem>
            ))}
            <ActiveTab ref={tabActive2} />
          </TabsWrap>
        </HeaderWrap>
        <ContentWrap id="scrollableDiv">
          <SpinWrap indicator={<NewLoadingTransition />} spinning={isSpinning}>
            {/* {Object.keys(dataList)?.map((k: any) => (
              <ItemWrap key={k}>
                <TimeName>{k}</TimeName>
                <GroupItems
                  row={dataList[k]}
                  onOpenExamine={onOpenExamine}
                  onClickItem={onClickItem}
                  tabActive={tabActive}
                  onChangeData={onChangeData}
                />
              </ItemWrap>
            ))} */}

            <InfiniteScroll
              dataLength={
                dataList.list ? Object.values(dataList.list).flat(2).length : 0
              }
              next={fetchMoreData}
              hasMore={hasMore}
              loader={<Skeleton paragraph={{ rows: 1 }} active />}
              scrollableTarget="scrollableDiv"
            >
              {Object.keys(dataList)?.map((k: any) => (
                <ItemWrap key={k}>
                  <TimeName>{k}</TimeName>
                  <GroupItems
                    row={dataList[k]}
                    onOpenExamine={onOpenExamine}
                    onClickItem={onClickItem}
                    tabActive={tabActive}
                    onChangeData={onChangeData}
                  />
                </ItemWrap>
              ))}
            </InfiniteScroll>
            {JSON.stringify(data) === '{}' && <NoData />}
          </SpinWrap>
        </ContentWrap>
        <Border />
        <Footer onClick={onToMine}>{t('Check_out_my_work')}</Footer>
      </QuickPopover>
    </>
  )
}

export default QuickMine

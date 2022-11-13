<template>
  <div class="rank_wrap">
    <div class="rank_body">
      <div class="rank_body_title">排行榜</div>
      <div class="rank_body_list">
        <div class="rank_body_top_row">
          <div class="rank_body_top_row_rank">🏆</div>
          <div class="rank_body_top_row_time">用时</div>
          <div class="rank_body_top_row_name">名字</div>
          <div class="rank_body_top_row_words">感想</div>
        </div>
        <div class="rank_body_list_wrap">
          <div class="rank_body_list_item"
            v-for="(item, index) in rankList"
            :key="index"
          >
            <div class="rank_body_list_item_block rank_body_list_item_rank">
              <div class="rank_body_list_item_rank_cicle">{{ index + 1 }}</div>
            </div>
            <div class="rank_body_list_item_block rank_body_list_item_used_time">{{ formatTime(item.usedTime) }}</div>
            <div class="rank_body_list_item_block rank_body_list_item_name">
              <pop-over
                :text="item.name"
                :popOverText="`${item.name}${
                  item.date ? ' 刮开于 ' + getYYYYMMDD(item.date) : ''
                }`"
              />
            </div>
            <div class="rank_body_list_item_block rank_body_list_item_words">
              <pop-over
                :text="item.words"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="rank_go_back"
      @click="emitRouteChange('main-menu')"
    >返回</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import PopOver from '../component/PopOver.vue';
import { formatTime, getYYYYMMDD } from '@/utils/helper';
import API from '@/api';
import { EventBus } from '@/utils/eventBus';

@Component({
  components: {
    PopOver,
  },
})
export default class HelloWorld extends Vue {
  @Prop() private msg!: string;
  formatTime = formatTime;
  getYYYYMMDD = getYYYYMMDD;
  rankList: any[] = [];

  mounted() {
    this.getRankList();
  }

  async getRankList() {
    const res = await API.getRankList();
    this.rankList = res;
  }

  emitRouteChange(route: string) {
    this.$emit('routeChange', route);
    // play button music
    EventBus.$emit('playAudio', 'btn');
  }
}
</script>

<style scoped lang="stylus">

$golden-color = #a88300;

.rank_go_back
  position fixed
  top 20px
  left 10vw
  background-color #ffffffaa
  border-radius 15px
  padding 10px 20px
  margin 0
  cursor pointer
  user-select none
  &:hover
    background-color #fff
  &:active
    background-color #000
    color #fff
.rank_body
  position fixed
  top 50%
  left 50%
  transform translate(-50%, -50%)
  width 80vw
  height 80vh
  background-color #ffffffaa
  color #000
  border-radius 15px
  padding 20px
  box-sizing border-box
  .rank_body_title
    font-size 30px
    text-align center
    margin-bottom 20px
    user-select none
  .rank_body_list
    .rank_body_top_row
      display flex
      justify-content space-between
      border-bottom 1px solid #000
      padding 10px 0
      text-align left
      .rank_body_top_row_rank
        width 10%
      .rank_body_top_row_name
        width 30%
      .rank_body_top_row_time
        width 20%
        color $golden-color
      .rank_body_top_row_words
        width 40%
    .rank_body_list_wrap
      height calc(80vh - 150px)
      overflow-y scroll
    ::-webkit-scrollbar
      width 5px
    ::-webkit-scrollbar-track
      background transparent
      border none
    ::-webkit-scrollbar-thumb
      background-color darkgrey
      width 5px
      color #aaa

    .rank_body_list_item
      display flex
      justify-content space-between
      align-items center
      height 50px
      text-align left
      // .rank_body_list_item_block 
      //   overflow hidden
      .rank_body_list_item_rank
        width 10%
        .rank_body_list_item_rank_cicle
          min-width 15px
          width min-content
          height 15px
          border-radius 8px
          padding 0 2px
          box-sizing border-box
          background-color $golden-color
          color #fff
          text-align center
          line-height 15px
          font-size 10px

      .rank_body_list_item_name
        width 30%
        text-overflow ellipsis
        white-space nowrap
      .rank_body_list_item_used_time
        width 20%
        color $golden-color
        font-weight bold
        text-shadow 0 0 5px #fff
      .rank_body_list_item_words
        width 40%
    


</style>

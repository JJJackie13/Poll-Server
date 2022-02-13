import { Knex } from "knex";

export class PollService {
    constructor(private knex: Knex) {}
    
    getAllActivateCampaigns = async (offset: number = 0, limit: number = 10) => {
        try {
            const activateCampaigns = (await this.knex.raw(
                `select
                    distinct(select count(*) from votes join poll_options 
                    on poll_options.id = votes.poll_options_id where poll.id = poll_options.poll_id) as totalVote,
                    poll.title, poll.start_time, poll.end_time
                    from poll
                    join poll_options on poll.id = poll_options.poll_id
                    join votes on poll_options.id = votes.poll_options_id
                    where end_time > now()
                    order by totalVote desc
                    limit :limit offset :offset;`,
                    {limit, offset}
            )).rows
            return { success: true, data: activateCampaigns };
        } catch (error) {
            return { success: false };
        }
    }
    getAllEndedCampaigns = async (offset: number = 0, limit: number = 10) => {
        try {
            const endedCampaigns = (await this.knex.raw(
                `select
                    distinct(select count(*) from votes join poll_options 
                    on poll_options.id = votes.poll_options_id where poll.id = poll_options.poll_id) as totalVote,
                    poll.title, poll.start_time, poll.end_time
                    from poll
                    join poll_options on poll.id = poll_options.poll_id
                    join votes on poll_options.id = votes.poll_options_id
                    where end_time < now()
                    order by totalVote desc
                    limit :limit offset :offset;`,
                    {limit, offset}
            )).rows
            return { success: true, data: endedCampaigns };
        } catch (error) {
            return { success: false };
        }
    }
    getCampaignsById = async (pollId: number) => {
        try {
            const campaign = (await this.knex.raw(
                `select
                    distinct(select COUNT(*) from votes where poll_options.id = votes.poll_options_id) as vote_number,
                    poll.title, poll.start_time, poll.end_time,
                    poll_options.name
                    from poll 
                    join poll_options on poll.id = poll_options.poll_id
                    join votes on poll_options.id = votes.poll_options_id
                    where poll.id = :pollId;`,
                    {pollId}
            )).rows
            return { success: true, data: campaign };
        } catch (error) {
            return { success: false };
        }
    }
    postVote = async (userId: number, pollOptionId: number) => {
        try {
            await this.knex("votes").insert({
                user_id: userId,
                poll_options_id: pollOptionId
            });
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    checkUserVoteExist = async (userId: number, pollOptionId: number) => {
        const userCheck = await this.knex("votes")
            .select("*")
            .where("user_id", userId)
            .andWhere("pollOptionId", pollOptionId);
        return userCheck;
    }
    checkCampaignValidity = async (pollOptionId: number) => {
        try {
            const result = (await this.knex.raw(
                `select poll_options.id from poll
                join poll_options on poll.id = poll_options.poll_id
                where end_time < now()
                and poll_options.id = :pollOptionsId;`,
                { pollOptionId }
            )).rows
            return result;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    postNewCampaign = async (userId: number, data: any) => {
        const {
            title,
            start_time,
            end_time,
            nameList,
        } = data;
        try {
            await this.knex.transaction(async (trx) => {
                const pollId = (
                    await trx("poll")
                    .insert({
                        user_id: userId,
                        title,
                        start_time,
                        end_time,
                    })
                    .returning("id")
                )[0];
                
                await trx("poll_options").insert(
                    nameList.map((name: string) => {
                        return { poll_id: pollId, name: name };
                    })
                );
            });
            return true;
        } catch (error) {
            console.log("postNewCampaign: ", error);
            return false;
        }
    }
    checkCampaignOwner = async (userId: number, pollId: number) => {
        const owner = await this.knex("poll")
            .select("*")
            .where("user_id", userId)
            .andWhere("id", pollId);
        return owner;
    }
    updateCampaign = async (pollId: number, data: any) => {
        const {
            title,
            start_time,
            end_time,
        } = data;
        try {
            await this.knex("poll")
            .update({
                title,
                start_time,
                end_time,
            })
            .where("id", pollId);
            return true;
        } catch (error) {
            console.log("updateCampaign: ", error);
            return false;
        }
    }
}